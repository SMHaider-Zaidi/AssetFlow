import * as db from '../models/dbQueries.js';

export const getMyBookings = async (req, res, next) => {
    const { uId, orgId } = req.session.user;
    try {
        const [currentBookings, futureBookings] = await Promise.all([
            db.getCurrentUserBookings(uId, orgId),
            db.getFutureUserBookings(uId, orgId)
        ]);

        res.render('employee/dashboard', { 
            currentBookings,
            futureBookings,
            user: req.session.user,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        next(error);
    }
};

export const getCatalog = async (req, res, next) => {
    const { orgId } = req.session.user;
    try {
        const [categories, allResources] = await Promise.all([
            db.getCategoriesByOrg(orgId),       
            db.getResourcesByOrg(orgId)         
        ]);

        res.render('employee/catalog', { 
            categories,         
            allResources,      
            user: req.session.user,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailableNow = async (req, res, next) => {
    const { orgId } = req.session.user;
    try {
        const availableResources = await db.getBookableResourcesByOrg(orgId);

        res.render('employee/available', { 
            availableResources,
            user: req.session.user,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        next(error);
    }
};

export const getBookingHistory = async (req, res, next) => {
    const { uId, orgId } = req.session.user;
    try {
        const history = await db.getPastBookings(uId, orgId); 

        res.render('employee/history', {
            history,
            user: req.session.user
        });
    } catch (error) {
        next(error);
    }
};


export const getGuidelines = async (req, res, next) => {
    try {
        const guidelines = [
            { title: "Usage Responsibility", content: "All bookings, cancellations, and logs are tracked for audit purposes. Never share your account access, as you are responsible for the resources reserved under your profile." },
            { title: "Responsible Handling", content: "Employees are responsible for the physical condition of the asset." },
            { title: "Return Policy", content: "Assets must be returned by the end-time to avoid collisions." },
            { title: "Data Security", content: "Log out of all personal accounts on IT hardware before returning." }
        ];

        res.render('employee/guidelines', {
            guidelines,
            user: req.session.user
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    const { orgId } = req.session.user;
    try {
       
        const organization = await db.findOrgByName(orgId);

        res.render('employee/profile', {
            organization,
            user: req.session.user
        });
    } catch (error) {
        next(error);
    }
};


export const processBooking = async (req, res, next) => {
    const { uId, orgId, userName } = req.session.user;
    const { resId, resName, date, startTime, endTime } = req.body;

    try {
        const startDateTime = `${date} ${startTime}:00`;
        const endDateTime = `${date} ${endTime}:00`;
        
        const now = new Date();
        const bookingStart = new Date(startDateTime);
        const bookingEnd = new Date(endDateTime);

        // FIX FOR BUG #2: Add a 2-minute grace period to "now" 
        // This prevents the "Time is in the past" error due to 1-2 second differences
        const nowWithGrace = new Date(now.getTime() - 120000); 

        // 1. VALIDATION
        if (bookingStart >= bookingEnd) {
            return res.redirect('/employee/catalog?error=End time must be after start time.');
        }
        if (bookingStart < nowWithGrace) {
            return res.redirect('/employee/catalog?error=Start time cannot be in the past.');
        }

        // --- NEW MAX DURATION VALIDATION START ---
        // Calculate the requested duration in minutes
        const requestedDurationMinutes = (bookingEnd - bookingStart) / (1000 * 60);

        // Fetch max duration rule from the model function we just created
        // Note: Assuming 'db' is your imported model object containing the function
        const resourceRule = await db.getResourceMaxDuration(resId);

        if (resourceRule && resourceRule.Max_Duration_Minutes !== null) {
            if (requestedDurationMinutes > resourceRule.Max_Duration_Minutes) {
                return res.redirect(`/employee/catalog?error=Booking exceeds maximum allowed duration of ${resourceRule.Max_Duration_Minutes} minutes for this resource category.`);
            }
        }
       
        const resourceDetails = await db.getResourceById(resId, orgId); 
        
        if (!resourceDetails) {
            return res.redirect('/employee/catalog?error=Resource not found.');
        }

        if (resourceDetails.Status === 'Maintenance') {
            return res.redirect('/employee/catalog?error=Operation denied: This resource is currently offline for maintenance updates.');
        }
        if (resourceDetails.Status === 'Archived') {
            return res.redirect('/employee/catalog?error=Operation denied: This resource has been archived and is no longer available.');
        }

        // 2. AVAILABILITY CHECK
        const isAvailable = await db.checkAvailability(resId, startDateTime, endDateTime);
        if (!isAvailable) {
            return res.redirect('/employee/catalog?error=Resource is already booked for this slot');
        }

        // 3. CREATE BOOKING
        await db.createBooking({ 
            orgId, 
            uId, 
            resId, 
            startTime: startDateTime, 
            endTime: endDateTime 
        });

        if (now >= bookingStart && now < bookingEnd) {
            await db.updateResourceStatus(resId, 'Occupied', orgId);
        }

        await db.insertAuditLog(orgId, uId, `${userName} created booking for ${resourceDetails.Res_Name} from ${startDateTime} to ${endDateTime}`);
        res.redirect('/employee/dashboard?success=Booking confirmed!');
        
    } catch (error) { 
        next(error); 
    }
};

export const handleCancel = async (req, res, next) => {
    const { uId, orgId, role: roleName, userName } = req.session.user;
    const { bId } = req.params;

    try {
        
        const booking = await db.getBookingById(bId);

        const wasCancelled = await db.cancelBooking(bId, uId, roleName, orgId);
        
        if (wasCancelled && booking.length > 0) {
            const resId = booking[0].Res_id;

            await db.updateResourceStatus(resId, 'Available', orgId);

            await db.insertAuditLog(orgId, uId, `${userName} cancelled booking ${bId}`);
            res.redirect('/employee/dashboard?success=Booking cancelled');
        } else {
            res.redirect('/employee/dashboard?error=Cancellation failed');
        }
    } catch (error) { 
        console.error('Error in handleCancel:', error);
        next(error); 
    }
};

