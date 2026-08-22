import * as db from '../models/dbQueries.js';


// Main SuperAdmin Dashboard

export const showSuperDashboard = async (req, res, next) => {
    try {
        const [stats, organizations, globalLogs, recentOrgs] = await Promise.all([
            db.getGlobalSystemStatsForSuperAdmin(),
            db.getAllOrganizationsForSuperAdmin(),
            db.getGlobalAuditLogsForSuperAdmin(),
            db.getRecentOrgsForSuperAdmin()
        ]);

        return res.render('superadmin/dashboard', {
            user: req.session.user,
            stats,          // { total_orgs, total_active_users, total_resources }
            organizations,  // Array of { Org_id, Org_name }
            globalLogs,     // Array of 100 most recent logs from across all orgs
            recentOrgs      // Array of 5 most recent organizations
        });
    } catch (error) {
    
        return next(error);
    }
};

// View all organizations 
export const listOrganizations = async (req, res, next) => {
    try{
        const organizations = await db.getAllOrganizationsForSuperAdmin();
        
        if(!organizations || organizations.length === 0) {
            return res.status(404).render('error', { message: 'No organizations found' });
        }
        return res.render('superadmin/organizations', {
            userName: req.session.user.userName,
            organizations
        });
    } catch (error) {
        return next(error);
    }
};


//Drill-down into specific Organization Stats
export const getSpecificOrgStats = async (req, res, next) => {
    const { orgId } = req.params;

    try {
        const [
            orgStats, 
            orgLogs, 
            orgUsers, 
            orgResources, 
            orgCategories,
            orgBookings 
        ] = await Promise.all([
            db.getOrgStatsForSuperAdmin(orgId),
            db.getLogsByOrg(orgId),
            db.getOrgUsers(orgId),
            db.getResourcesByOrg(orgId),
            db.getCategoriesByOrg(orgId),
            db.getBookings(orgId) // null for uId gets ALL org bookings
        ]);

        if (!orgStats) {
            return res.status(404).render('error', { message: 'Organization not found' });
        }

        return res.render('superadmin/organization', {
            userName: req.session.user.userName,
            stats: orgStats,
            logs: orgLogs,
            users: orgUsers,
            resources: orgResources,
            categories: orgCategories,
            bookings: orgBookings, 
            orgId: orgId
        });
    } catch (error) {
        return next(error);
    }
};