// import * as db from '../models/dbQueries.js';
// import bcrypt from 'bcryptjs';
// import { sendInviteEmail } from '../utils/mailer.js';

// // 1. Dashboard Overview Rendering Logic
// export const showAdminDashboard = async (req, res, next) => {
//     try {
//         const orgId = req.session.user.orgId;

//         // Perform parallel real-time metric computations
//         const [users, allAssets, logs] = await Promise.all([
//             db.getOrgUsers(orgId),
//             db.getResourcesByOrg(orgId),
//             db.getLogsByOrg(orgId)
//         ]);

//         const activeBookingsCount = allAssets.filter(r => r.Status === 'Occupied').length;
//         const totalResourcesCount = allAssets.length;
        
//         // Compute structural metrics
//         const stats = {
//             activeBookings: activeBookingsCount,
//             totalResources: totalResourcesCount,
//             totalUsers: users.length,
//             utilizationRate: totalResourcesCount > 0 
//                 ? `${Math.round((activeBookingsCount / totalResourcesCount) * 100)}%` 
//                 : '0%'
//         };

//         return res.render('admin/dashboard', {
//             user: req.session.user,
//             stats,
//             logs: logs.slice(0, 10) // Limit feed view display directly on dashboard
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // 2. Manage Users Dedicated View
// export const showManageUsers = async (req, res, next) => {
//     try {
//         const role = req.session.user.role;
//         if (role !== 'Admin') {
//             return res.redirect('/admin/dashboard?error=Unauthorized access to user management');
//         }
//         const orgId = req.session.user.orgId;
//         const users = await db.getOrgUsers(orgId);
        
//         return res.render('admin/users', {
//             user: req.session.user,
//             users,
//             success: req.query.success || null,
//             error: req.query.error || null
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // 3. Manage Resources Dedicated View (Combined Filters)
// export const showManageResources = async (req, res, next) => {
//     try {
//         const orgId = req.session.user.orgId;
//         const [allResources, categories] = await Promise.all([
//             db.getResourcesByOrg(orgId),
//             db.getCategoriesByOrg(orgId)
//         ]);

//         return res.render('admin/resources', {
//             user: req.session.user,
//             allResources,
//             categories,
//             success: req.query.success || null,
//             error: req.query.error || null
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // 4. Manage Categories Dedicated View
// export const showManageCategories = async (req, res, next) => {
//     try {
//         const orgId = req.session.user.orgId;
//         const categories = await db.getCategoriesByOrg(orgId);

//         return res.render('admin/categories', {
//             user: req.session.user,
//             categories,
//             success: req.query.success || null,
//             error: req.query.error || null
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // 5. Booking Control Monitor View (Targeted: Only Active Live Records)
// export const showBookingControlLogs = async (req, res, next) => {
//     try {
//         const orgId = req.session.user.orgId;
//         // Clean split: only fetch currently running active bookings
//         const activeBookings = await db.getActiveBookingsByOrg(orgId);

//         return res.render('admin/bookings', {
//             user: req.session.user,
//             activeBookings,
//             success: req.query.success || null,
//             error: req.query.error || null
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // 6. Security Logs Dedicated Audit Trail View
// export const showAuditLogsPage = async (req, res, next) => {
//     try {
//         const orgId = req.session.user.orgId;
//         const logs = await db.getLogsByOrg(orgId);

//         return res.render('admin/logs', {
//             user: req.session.user,
            
//             logs,
//             success: req.query.success || null,
//             error: req.query.error || null
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // 7. Admin Profile View Placeholder
// export const showAdminProfile = async (req, res, next) => {
//     try {
//         return res.render('admin/profile', { user: req.session.user });
//     } catch (error) {
//         next(error);
//     }
// };

// // --- Action Post Controllers ---

// export const addCategory = async(req, res, next) => {
//     const { orgId, uId, userName } = req.session.user;
//     const { name } = req.body;
//     try {
//         await db.addCategory({ name, orgId });
        
//         await db.insertAuditLog(orgId, uId, `added new category: "${name}"`);
//         return res.redirect('/admin/categories?success=Category added successfully');
//     } catch(error) {
//         next(error);
//     }
// };

// export const deleteCategory = async(req, res, next) => {
//     const { orgId, uId, userName } = req.session.user;
//     const { catId, categoryName } = req.body;
//     try {
//         await db.deleteCategory(catId, orgId);
//         await db.insertAuditLog(orgId, uId, `deleted category: "${categoryName}"`);
//         return res.redirect('/admin/categories?success=Category deleted successfully');
//     } catch (error) {
//         next(error);
//     }
// };

// export const addResource = async (req, res, next) => {
//     const { orgId, uId, userName } = req.session.user;
//     const { name, categoryId } = req.body;
//     try {
//         await db.addResource({ name, categoryId, orgId });
//         await db.insertAuditLog(orgId, uId, `added resource: "${name}"`);
//         return res.redirect('/admin/resources?success=Resource added successfully');
//     } catch(error) {
//         next(error);
//     }
// };

// export const deleteResource = async (req, res, next) => {
//     const { orgId, uId, userName } = req.session.user;
//     const { resId, name } = req.body;
//     try {
       
//         const result = await db.deleteResource(resId, orgId);
//         const logMsg = `deleted resource: "${name}" (ID: ${resId}) - cancelled ${result.cancelledBookings} active booking(s)`;
//         await db.insertAuditLog(orgId, uId, logMsg);
        
//         return res.redirect('/admin/resources?success=Resource archived and future bookings cleared successfully');
//     } catch (error) {
//         next(error);
//     }
// };

// export const addOrgUser = async (req, res, next) => {
//     const { orgId, orgName, uId, userName } = req.session.user;
//     const { name, email, password, roleId } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         await db.createOrgUser({ orgId, roleId, name, email, password: hashedPassword });
//         await sendInviteEmail(email, password, name, orgName);
        
//         await db.insertAuditLog(orgId, uId, `created user profile: ${name} (${email})`);
//         return res.redirect('/admin/users?success=User created and notified successfully');
//     } catch (error) {
//         if (error.code === 'ER_DUP_ENTRY') {
//             return res.redirect('/admin/users?error=Email profile already registered');
//         }
//         next(error);
//     }
// };

// export const deleteOrgUser = async (req, res, next) => {
//     const { orgId, uId, userName } = req.session.user;
    
//     // FIX: Match the 'uId' name coming directly from your HTML form input field
//     const { uId: targetId, targetName } = req.body; 
    
//     try {
//         if (!targetId) {
//             return res.redirect('/admin/users?error=Target identifier parameter missing');
//         }

//         if (targetId == uId) {
//             return res.redirect('/admin/users?error=Self-deletion operations are blocked safety-wise');
//         }

//         const affected = await db.deleteOrgUser(targetId, orgId);
//         if (affected === 0) {
//             return res.redirect('/admin/users?error=User profile targeting mismatch');
//         }

//         await db.insertAuditLog(orgId, uId, `deleted user profile: ${targetName} (ID: ${targetId})`);
//         return res.redirect('/admin/users?success=User account removed completely');
//     } catch (error) {
//         next(error);
//     }
// };

// export const toggleMaintenance = async (req, res, next) => {
//     const { resId, currentStatus, resName } = req.body;
//     const { orgId, uId, userName } = req.session.user;

//     let newStatus;
//     let logMsg;
//     if (currentStatus === 'Available') {
//         newStatus = 'Maintenance';
//         logMsg = `set "${resName}" into maintenance mode`;
//     } else if (currentStatus === 'Maintenance') {
//         newStatus = 'Available';
//         logMsg = `returned "${resName}" to available status from maintenance mode`;
//     }else{newStatus = currentStatus} // No change for Occupied or Archived states

//     try{
//         const result = await db.updateResourceStatus(resId, newStatus, orgId);
//         logMsg = `shifted "${resName}" status state to ${newStatus}`;
//         if (newStatus === 'Maintenance') {
//             logMsg += ` - automatically cancelled ${result.cancelledBookings} conflict booking(s)`;
//         }

//         await db.insertAuditLog(orgId, uId, logMsg);
//         return res.redirect('/admin/resources?success=Resource maintenance condition updated');
//     } catch (error) {
//         next(error);
//     }
// };

// export const cancelAnyBooking = async (req, res, next) => {
//     const { bId, resourceName, employeeName } = req.body;
//     const { orgId, uId, userName } = req.session.user;
//     const roleName = req.session.user.role;
//     try {
//         await db.cancelBooking(bId, uId, roleName, orgId);
//         await db.insertAuditLog(orgId, uId, `administrative-cancelled ${employeeName}'s booking window on ${resourceName}`);
//         return res.redirect('/admin/bookings?success=Target booking slot cancelled successfully');
//     } catch (error) {
//         next(error);
//     }
// };

// // FIXED: Remapped keys to match model schema definition properties precisely (Name, Action, Timestamp)
// export const downloadOrgLogs = async (req, res, next) => {
//     const { orgId } = req.session.user;
//     try {
//         const logs = await db.getLogsByOrg(orgId);
//         let csvContent = "User,Action,Timestamp\n";
//         logs.forEach(log => {
//             csvContent += `"${log.Name || 'System Service Engine'}","${log.Action}","${log.Timestamp}"\n`;
//         });
//         res.setHeader('Content-Type', 'text/csv');
//         res.setHeader('Content-Disposition', `attachment; filename=logs_org_${orgId}.csv`);
//         return res.status(200).send(csvContent);
//     } catch (error) {
//         next(error);
//     }
// };


import * as db from '../models/dbQueries.js';
import bcrypt from 'bcryptjs';
import { sendInviteEmail, sendCancellationEmail} from '../utils/mailer.js';

// 1. Dashboard Overview Rendering Logic
export const showAdminDashboard = async (req, res, next) => {
    try {
        const orgId = req.session.user.orgId;

        // Perform parallel real-time metric computations
        const [users, allAssets, logs] = await Promise.all([
            db.getOrgUsers(orgId),
            db.getResourcesByOrg(orgId),
            db.getLogsByOrg(orgId)
        ]);

        const activeBookingsCount = allAssets.filter(r => r.Status === 'Occupied').length;
        const totalResourcesCount = allAssets.length;
        
        // Compute structural metrics
        const stats = {
            activeBookings: activeBookingsCount,
            totalResources: totalResourcesCount,
            totalUsers: users.length,
            utilizationRate: totalResourcesCount > 0 
                ? `${Math.round((activeBookingsCount / totalResourcesCount) * 100)}%` 
                : '0%'
        };

        return res.render('admin/dashboard', {
            user: req.session.user,
            stats,
            logs: logs.slice(0, 10) // Limit feed view display directly on dashboard
        });
    } catch (error) {
        next(error);
    }
};

// 2. Manage Users Dedicated View
export const showManageUsers = async (req, res, next) => {
    try {
        const role = req.session.user.role;
        if (role !== 'Admin') {
            return res.redirect('/admin/dashboard?error=Unauthorized access to user management');
        }
        const orgId = req.session.user.orgId;
        const users = await db.getOrgUsers(orgId);
        
        return res.render('admin/users', {
            user: req.session.user,
            users,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (error) {
        next(error);
    }
};

// 3. Manage Resources Dedicated View (Combined Filters)
export const showManageResources = async (req, res, next) => {
    try {
        const orgId = req.session.user.orgId;
        const [allResources, categories] = await Promise.all([
            db.getResourcesByOrg(orgId),
            db.getCategoriesByOrg(orgId)
        ]);

        return res.render('admin/resources', {
            user: req.session.user,
            allResources,
            categories,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (error) {
        next(error);
    }
};

// 4. Manage Categories Dedicated View
export const showManageCategories = async (req, res, next) => {
    try {
        const orgId = req.session.user.orgId;
        const categories = await db.getCategoriesByOrg(orgId);

        return res.render('admin/categories', {
            user: req.session.user,
            categories,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (error) {
        next(error);
    }
};

// 5. Booking Control Monitor View (Targeted: Only Active Live Records)
export const showBookingControlLogs = async (req, res, next) => {
    try {
        const orgId = req.session.user.orgId;
        // Clean split: only fetch currently running active bookings
        const activeBookings = await db.getActiveBookingsByOrg(orgId);

        return res.render('admin/bookings', {
            user: req.session.user,
            activeBookings,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (error) {
        next(error);
    }
};

// 6. Security Logs Dedicated Audit Trail View
export const showAuditLogsPage = async (req, res, next) => {
    try {
        const orgId = req.session.user.orgId;
        const logs = await db.getLogsByOrg(orgId);

        return res.render('admin/logs', {
            user: req.session.user,
            logs,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (error) {
        next(error);
    }
};

// 7. Admin Profile View Placeholder
export const showAdminProfile = async (req, res, next) => {
    try {
        return res.render('admin/profile', { user: req.session.user });
    } catch (error) {
        next(error);
    }
};

// --- Action Post Controllers ---

export const addCategory = async(req, res, next) => {
    const { orgId, uId, userName } = req.session.user;
    const { name, maxDuration } = req.body; 
    try {
        const existingCategory = await db.getCategoryByNameAndOrg(name, orgId);
        if (existingCategory) {
            return res.redirect(`/admin/categories?error=A category named "${name}" already exists in your organization`);
        }

        await db.addCategory({ name, orgId, maxDuration });
        
        await db.insertAuditLog(orgId, uId, `${userName} added new category: "${name}"`);
        return res.redirect('/admin/categories?success=Category added successfully');
    } catch(error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    const { orgId, uId, userName } = req.session.user;
    const { catId, name } = req.body;

    try {
        const actualName = name || `ID: ${catId}`;

        await db.deleteCategory(catId, orgId);
        await db.insertAuditLog(orgId, uId, `${userName} deleted category: "${actualName}"`);
        return res.redirect('/admin/categories?success=Category deleted successfully');
        
    } catch (error) {
        // check if the error is a foreign key constraint violation (MySQL error code 1451) measning there are still resources linked to this category
        if (error.errno === 1451 || error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.redirect('/admin/categories?error=Cannot delete category because it still contains active resources. Remove or reassign those resources first.');
        }
        next(error);
    }
};

export const addResource = async (req, res, next) => {
    const { orgId, uId, userName } = req.session.user;
    const { name, categoryId } = req.body;
    try {
        const existingResource = await db.getResourceByNameAndOrg(name, orgId);
        if (existingResource) {
            return res.redirect(`/admin/resources?error=A resource named "${name}" already exists in your organization`);
        }

        await db.addResource({ name, categoryId, orgId });
        
        await db.insertAuditLog(orgId, uId, `${userName} added resource: "${name}"`);
        return res.redirect('/admin/resources?success=Resource added successfully');
    } catch(error) {
        next(error);
    }
};

export const deleteResource = async (req, res, next) => {
    const { orgId, uId, userName } = req.session.user;
    const { resId, name } = req.body;
    try {
        // Look up verified name property from database record fallback if req.body parameter missing
        const resource = await db.getResourceById(resId, orgId);
        const actualName = name || (resource ? resource.Res_name : `ID: ${resId}`);

        // Run deletion which now collects user rows before dropping bookings
        const result = await db.deleteResource(resId, orgId);
        
        // EMAIL NOTIFICATION LOOP FOR DELETED RESOURCE
        if (result.notifiedUsers && result.notifiedUsers.length > 0) {
            const emailPromises = result.notifiedUsers.map(user => 
                sendCancellationEmail(
                    user.Email, 
                    user.EmployeeName, 
                    actualName, 
                    "This resource has been permanently removed or archived from the system inventory by the administrator."
                )
            );
            await Promise.all(emailPromises);
        }

        const logMsg = `deleted resource: "${actualName}" (ID: ${resId}) - cancelled ${result.cancelledBookings} active booking(s)`;
        await db.insertAuditLog(orgId, uId, logMsg);
        
        return res.redirect('/admin/resources?success=Resource archived and future bookings cleared successfully');
    } catch (error) {
        next(error);
    }
};

export const addOrgUser = async (req, res, next) => {
    const { orgId, orgName, uId, userName } = req.session.user;
    const { name, email, password, roleId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.createOrgUser({ orgId, roleId, name, email, password: hashedPassword });
        await sendInviteEmail(email, password, name, orgName);
        
        await db.insertAuditLog(orgId, uId, `created user profile: ${name} (${email})`);
        return res.redirect('/admin/users?success=User created and notified successfully');
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.redirect('/admin/users?error=Email profile already registered');
        }
        next(error);
    }
};

// export const deleteOrgUser = async (req, res, next) => {
//     const { orgId, uId, userName } = req.session.user;
    
//    
//     const { uId: targetId, targetName } = req.body; 
    
//     try {
//         if (!targetId) {
//             return res.redirect('/admin/users?error=Target identifier parameter missing');
//         }

//         if (targetId == uId) {
//             return res.redirect('/admin/users?error=Self-deletion operations are blocked safety-wise');
//         }

//         const affected = await db.deleteOrgUser(targetId, orgId);
//         if (affected === 0) {
//             return res.redirect('/admin/users?error=User profile targeting mismatch');
//         }

//         await db.insertAuditLog(orgId, uId, `deleted user profile: ${targetName} (ID: ${targetId})`);
//         return res.redirect('/admin/users?success=User account removed completely');
//     } catch (error) {
//         next(error);
//     }
// };

export const deleteOrgUser = async (req, res, next) => {
    const { orgId, uId } = req.session.user; // Current logged-in Admin info
    const { uId: targetId, targetName } = req.body; // User to be deleted
    
    try {
        if (!targetId) {
            return res.redirect('/admin/users?error=Target identifier parameter missing');
        }

        if (targetId == uId) {
            return res.redirect('/admin/users?error=Self-deletion operations are blocked safety-wise');
        }

        // Run the complete cleanup and soft-delete process
        const affected = await db.deleteOrgUser(targetId, orgId);
        if (affected === 0) {
            return res.redirect('/admin/users?error=User profile targeting mismatch');
        }

        // Log the action for auditing
        await db.insertAuditLog(orgId, uId, `deleted user profile: ${targetName} (ID: ${targetId})`);
        
        return res.redirect('/admin/users?success=User account removed and bookings canceled successfully');
    } catch (error) {
        next(error);
    }
};
export const toggleMaintenance = async (req, res, next) => {
    const { resId, currentStatus, resName } = req.body;
    const { orgId, uId, userName } = req.session.user;

    try {
        const resource = await db.getResourceById(resId, orgId);
        const actualName = resName || (resource ? resource.Res_name : `ID: ${resId}`);

        let newStatus;
        // Allows switching back and forth smoothly regardless of background checks
        if (currentStatus === 'Maintenance') {
            newStatus = 'Available';
        } else {
            newStatus = 'Maintenance';
        }

        // Run status updates and collect user rows synchronously
        const result = await db.updateResourceStatus(resId, newStatus, orgId);
        
        let logMsg = `${userName} shifted "${actualName}" status state to ${newStatus}`;
        
        // EMAIL NOTIFICATION LOOP FOR MAINTENANCE CONFIRMATION
        if (newStatus === 'Maintenance' && result.notifiedUsers && result.notifiedUsers.length > 0) {
            logMsg += ` - automatically cancelled ${result.cancelledBookings} conflict booking(s)`;
            
            const emailPromises = result.notifiedUsers.map(user => 
                sendCancellationEmail(
                    user.Email, 
                    user.EmployeeName, 
                    actualName, 
                    "This resource has been taken offline temporarily for hardware maintenance or software updates."
                )
            );
            await Promise.all(emailPromises);
        }

        await db.insertAuditLog(orgId, uId, logMsg);
        return res.redirect('/admin/resources?success=Resource maintenance condition updated successfully');
    } catch (error) {
        next(error);
    }
};

export const cancelAnyBooking = async (req, res, next) => {
    const { bId, resourceName, employeeName } = req.body;
    const { orgId, uId, userName } = req.session.user;
    const roleName = req.session.user.role;
    try {
        // Fetch booking details to get the target employee's email address and fallback properties
        const bookingDetail = await db.getBookingById(bId);
        
        let targetResourceName = resourceName || (bookingDetail ? bookingDetail.Res_name : `Asset Reference ID: ${bId}`);
        let targetEmployeeName = employeeName || (bookingDetail ? bookingDetail.EmployeeName : 'Employee');

        // Perform the administrative cancellation operation
        await db.cancelBooking(bId, uId, roleName, orgId);
        
        // EMAIL NOTIFICATION DISPATCH FOR SINGLE CANCELLATION
        if (bookingDetail && bookingDetail.Email) {
            await sendCancellationEmail(
                bookingDetail.Email,
                targetEmployeeName,
                targetResourceName,
                "This reservation slot has been manually cancelled by the system administrator for scheduling updates or operational reasons."
            );
        }

        // Updated log message base to explicitly state which administrator cancelled the booking
        const logMsg = `${userName} administrative-cancelled ${targetEmployeeName}'s booking window on ${targetResourceName}`;
        await db.insertAuditLog(orgId, uId, logMsg);
        
        return res.redirect('/admin/bookings?success=Target booking slot cancelled successfully');
    } catch (error) {
        next(error);
    }
};

export const downloadOrgLogs = async (req, res, next) => {
    const { orgId } = req.session.user;
    try {
        const logs = await db.getLogsByOrg(orgId);
        let csvContent = "User,Action,Timestamp\n";
        logs.forEach(log => {
            csvContent += `"${log.Name || 'System Service Engine'}","${log.Action}","${log.Timestamp}"\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=logs_org_${orgId}.csv`);
        return res.status(200).send(csvContent);
    } catch (error) {
        next(error);
    }
};