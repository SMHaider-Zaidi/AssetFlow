/* Comments and documentation for the database query functions

============================================================================================================
 Section 1: Authentication & Identity 
============================================================================================================

findUserByEmail(email)
--------------------------

Purpose: Used during login to find the user's password hash and Org_id.

findRolePermissions(roleId)
---------------------------

Purpose: To check if the user is an 'Admin' or 'Employee' so the UI knows what buttons to show.

===============================================================================================================
Section 2: Tenant Operations 
===============================================================================================================

===User & Org Management (Admin only)===

createOrgUser(userData)
--------------------------
Purpose: When an Admin adds a new employee to their team.

deleteOrgUser(uId)
--------------------------
Purpose: When an Admin removes an employee from their team.

getOrgUsers(orgId)
--------------------
Purpose: To list all employees belonging to that specific company.

===Resource Management===

getResourcesByOrg(orgId)
------------------------
Purpose: Shows the "inventory" (MacBooks, Rooms, etc.) for that company.

addResource(resourceData)
------------------------------
Purpose: Admin adding a new asset to their inventory.

deleteResource(resId)
------------------------------
Purpose: Admin removing an asset from their inventory.

updateResourceStatus(resId, status)
--------------------------------------
Purpose: To flip an asset from 'Available' to 'Booked'.

getCategoriesByOrg(orgId)
------------------------------
Purpose: Fetches the list of categories (e.g., "IT Hardware") for the Admin.

getResourcesByCategory(catId, orgId)
--------------------------------------
Purpose: The "Drill-Down" function to see assets inside a specific category.

===Booking System===

checkAvailability(resId, startTime, endTime)
-----------------------------------------------
Purpose: Prevents double-booking by checking for overlaps in the BOOKINGS table.

createBooking(bookingData)
----------------------------------
Purpose: Saves a new reservation in the database.

cancelBooking(bookingId)
----------------------------
Purpose: Allows an employee to cancel a booking they have made.

getUserBookings(uId)
-------------------------
Purpose: Allows an employee to see a list of things they have personally booked.

===Audit Logs===

getLogsByOrg(orgId)
----------------------------
Purpose: Allows the Org Admin to see the history of actions within their company.

insertAuditLog(orgId, uId, action)
--------------------------------------
Purpose: A background function called every time someone does something important.

=============================================================================================================
  Section 3: SuperAdmin Operations 
=============================================================================================================

getAllOrganizationsForSuperAdmin()
------------------------
Purpose: Lists every company registered on the platform. 

getGlobalSystemStatsForSuperAdmin()
-------------------------
Purpose: Aggregate counts of total organizations, users, resources, and bookings.

getGlobalAuditLogsForSuperAdmin()
---------------------
Purpose: Retrieves a master feed of the most recent actions across all organizations.

getOrgStatsForSuperAdmin(orgId)
--------------------------------
Purpose: Gathers a snapshot of data (Users, Assets, Bookings) for a specific organization./*
 

// Code for database queries will go here, organized by the sections outlined above.

/*============================================================================================================
 Section 1: Authentication & Identity
=============================================================================================================*/

import pool from '../config/db.js';

export async function findOrgByName(orgName){
    const query = `SELECT Org_id FROM ORGANIZATION WHERE Org_name =? LIMIT 1`;
    try{
        const [rows] = await pool.execute(query, [orgName]);
        return rows[0] || null;
    }catch(error){
        console.error('Error in findOrgByName:', error);
        throw error;
    }
};

const roleId_admin = 1;
const roleId_emp = 2;
export async function registerNewOrg(data) {
    const connection = await pool.getConnection(); 
    try {
        await connection.beginTransaction();

        // Step 1: Create the Organization
        const orgQuery = `INSERT INTO ORGANIZATION (Org_name) VALUES (?)`;
        const [orgRows] = await connection.execute(orgQuery, [data.orgName]);
        const newOrgId = orgRows.insertId;


        // Create the Admin User
        const userQuery = `INSERT INTO USERS(Org_id, Role_id, Name, Email, Password, is_active) VALUES (?, ?, ?, ?, ?, TRUE)`;
        const [userRows] = await connection.execute(userQuery, [
            newOrgId, 
            roleId_admin, 
            data.adminName, 
            data.adminEmail, 
            data.adminPassword
        ]);

        await connection.commit();
        return { orgId: newOrgId, adminId: userRows.insertId };

    } catch (error) {
        await connection.rollback();
        console.error('Error in registerNewOrg:', error);
        throw error;
    } finally {
        connection.release();
    }
};

export async function findUserByEmail(email) {
    const query = `SELECT U_id, Name, Email, Password, Role_id, Org.Org_id, Org.Org_name FROM USERS JOIN ORGANIZATION Org ON USERS.Org_id = Org.Org_id WHERE Email = ? AND is_active = TRUE LIMIT 1`;
    try {

        const [rows] = await pool.execute(query, [email]);

        return rows[0] || null;

    } catch (error) {

        console.error('Error in findUserByEmail:', error);
        throw error;
    }
};

export async function findRoleName(roleId){
    const query = `SELECT Role_name FROM ROLES WHERE Role_id = ? LIMIT 1`;
    try{
        const [rows] = await pool.execute(query, [roleId]);
        return rows[0]? rows[0].Role_name:null;
    }catch(error){
        console.error('Error in findRoleName:', error);
        throw error;
    }
};

/*============================================================================================================
 Section 2: Tenant Operations
=============================================================================================================*/

export async function getOrgUsers(orgId){
    const query = `SELECT U_id, Name, Email, Role_Name FROM USERS JOIN ROLES ON USERS.Role_id = ROLES.Role_id WHERE Org_id =? AND is_active = TRUE`;
    try{
        const [rows] = await pool.execute(query, [orgId]);
        return rows;
    }catch(error){
        console.error('Error in getOrgUsers:', error);
        throw error;
    }
};

export async function createOrgUser(userData){        // userData is an object from the controller containing user details needed to create a new org user
    const query = `INSERT INTO USERS(Org_id, Role_id, Name, Email, Password, is_active) VALUES (?, ?, ?, ?, ?, TRUE)`;
    try{
        const [rows] = await pool.execute(query, [userData.orgId, userData.roleId, userData.name, userData.email, userData.password]);
        return rows.insertId;     // Return the ID of the newly created user
    }catch(error){
        console.error('Error in createOrgUser:', error);
        throw error;
    }
};

// export async function deleteOrgUser(uId, orgId){

//     // Soft delete by setting is_active to FALSE instead of permanently deleting the record

//     // scramble the email so the original email can be used again

//     const query =`UPDATE USERS SET is_active = FALSE, Email = CONCAT(Email, '_DEL_', U_id) WHERE U_id = ? AND Org_id = ? AND is_active = TRUE`;

//     try{

//         const [rows] = await pool.execute(query, [uId, orgId]);

//         return rows.affectedRows;     // Return the number of rows affected (should be 1 if successful)

//     }catch(error){

//         console.error('Error in deleteOrgUser:', error);

//         throw error;

//     }

//};

export async function deleteOrgUser(targetUserId, orgId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // STEP 1: Cancel all UPCOMING and ACTIVE bookings for this user
        // We set status to 'Cancelled' for bookings that haven't ended yet
        const cancelBookingsQuery = `
            UPDATE BOOKINGS 
            SET Status = 'Cancelled' 
            WHERE U_id = ? 
              AND Status = 'Confirmed' 
              AND End_Time >= NOW()
        `;
        await connection.execute(cancelBookingsQuery, [targetUserId]);

        // STEP 2: Soft delete the user and scramble email
        const deleteUserQuery = `
            UPDATE USERS 
            SET is_active = FALSE, 
                Email = CONCAT(Email, '_DEL_', U_id) 
            WHERE U_id = ? 
              AND Org_id = ? 
              AND is_active = TRUE
        `;
        const [userRows] = await connection.execute(deleteUserQuery, [targetUserId, orgId]);

        await connection.commit();
        return userRows.affectedRows; // Returns 1 if successful, 0 if user wasn't found/already inactive
    } catch (error) {
        await connection.rollback();
        console.error('Error in transactional deleteOrgUser:', error);
        throw error;
    } finally {
        connection.release();
    }
}

export async function getResourcesByOrg(orgId) {
    try {
        // STEP 1: Physically update resources that are NO LONGER occupied
        // If a resource is marked 'Occupied' but has no active booking, set it to 'Available'
        const cleanupQuery = `
            UPDATE RESOURCES R
            SET R.Status = 'Available'
            WHERE R.Org_id = ? 
              AND R.Status = 'Occupied'
              AND NOT EXISTS (
                  SELECT 1 FROM BOOKINGS B 
                  WHERE B.Res_id = R.Res_id 
                    AND B.Status = 'Confirmed' 
                    AND NOW() BETWEEN B.Start_Time AND B.End_Time
              )
        `;
        await pool.execute(cleanupQuery, [orgId]);

        // STEP 2: Physically update resources that SHOULD BE occupied now
        const occupyQuery = `
            UPDATE RESOURCES R
            SET R.Status = 'Occupied'
            WHERE R.Org_id = ? 
              AND R.Status = 'Available'
              AND EXISTS (
                  SELECT 1 FROM BOOKINGS B 
                  WHERE B.Res_id = R.Res_id 
                    AND B.Status = 'Confirmed' 
                    AND NOW() BETWEEN B.Start_Time AND B.End_Time
              )
        `;
        await pool.execute(occupyQuery, [orgId]);

        // STEP 3: Now select the data (simple query now because DB is consistent)
        const selectQuery = `
            SELECT 
                R.Res_id, 
                R.Res_name, 
                R.Cat_id, 
                R.Status,
                (SELECT B.End_Time FROM BOOKINGS B 
                 WHERE B.Res_id = R.Res_id 
                 AND B.Status = 'Confirmed' 
                 AND NOW() BETWEEN B.Start_Time AND B.End_Time 
                 LIMIT 1) AS End_Time
            FROM RESOURCES R
            WHERE R.Org_id = ? AND R.Status != 'Archived'
        `;
        
        const [rows] = await pool.execute(selectQuery, [orgId]);
        return rows;
    } catch (error) {
        console.error('Error in getResourcesByOrg sync:', error);
        throw error;
    }
};

export async function getResourceById(resId, orgId) {
    const query = `SELECT Status, Res_Name FROM RESOURCES WHERE Res_id = ? AND Org_id = ?`;
    try {
        const [rows] = await pool.execute(query, [resId, orgId]);
        return rows[0] || null; // Returns the single asset object or null if missing
    } catch (error) {
        console.error('Error in getResourceById:', error);
        throw error;
    }
};

export async function getBookableResourcesByOrg(orgId) {
    const query = `
        SELECT 
            R.Res_id, 
            R.Res_name, 
            C.Category_Name, 
            R.Status 
        FROM RESOURCES R
        LEFT JOIN RESOURCE_CATEGORY C ON R.Cat_id = C.Cat_id
        WHERE R.Org_id = ? 
        AND R.Status = 'Available'
    `;
    
    try {
        const [rows] = await pool.execute(query, [orgId]);
        return rows;
    } catch (error) {
        console.error('Error in getBookableResources:', error);
        throw error;
    }
};

export async function addResource(resourceData){
    const query = `INSERT INTO RESOURCES(Res_name, Cat_id, Org_id, Status) VALUES (?, ?, ?, 'Available')`;
    try{
        const [rows] = await pool.execute(query, [resourceData.name, resourceData.categoryId, resourceData.orgId]);
        return rows.insertId;     // Return the ID of the newly created resource
    }catch(error){
        console.error('Error in addResource:', error);
        throw error;
    }
};

export async function deleteResource(resId, orgId) {
    const fetchUsersQuery = `
        SELECT b.b_id, u.Email, u.Name AS EmployeeName
        FROM BOOKINGS b
        JOIN USERS u ON b.U_id = u.U_id
        WHERE b.Res_id = ? AND b.Org_id = ? AND b.End_Time > NOW()
    `;
    const archiveQuery = `UPDATE RESOURCES SET Status = 'Archived' WHERE Res_id = ? AND Org_id = ?`;
    const clearBookingsQuery = `DELETE FROM BOOKINGS WHERE Res_id = ? AND End_Time > NOW()`;
    
    try {
        // 1. Find who has active or future bookings before we clear them
        const [affectedUsers] = await pool.execute(fetchUsersQuery, [resId, orgId]);

        // 2. Archive the resource and remove the bookings
        const [rows] = await pool.execute(archiveQuery, [resId, orgId]);
        const [bookingResult] = await pool.execute(clearBookingsQuery, [resId]);
        
        return {
            resourceArchived: rows.affectedRows,
            cancelledBookings: bookingResult.affectedRows,
            notifiedUsers: affectedUsers // <-- Returning this for our mailer loop
        };
    } catch (error) {
        console.error('Error in deleteResource model:', error);
        throw error;
    }
}

export async function updateResourceStatus(resId, newStatus, orgId) {
    // Modified: Target ONLY active, valid bookings (ignore already cancelled or completed slots)
    const fetchUsersQuery = `
        SELECT b.B_id AS b_id, u.Email, u.Name AS EmployeeName
        FROM BOOKINGS b
        JOIN USERS u ON b.U_id = u.U_id
        WHERE b.Res_id = ? AND b.Org_id = ? 
          AND b.End_Time > NOW() 
          AND b.Status IN ('Confirmed', 'Occupied')
    `;

    // Modified: Set status to 'Cancelled' instead of hard deleting, clearing it from active user feeds
    const clearBookingsQuery = `
        UPDATE BOOKINGS 
        SET Status = 'Cancelled' 
        WHERE Res_id = ? AND End_Time > NOW() AND Status IN ('Confirmed', 'Occupied')
    `;

    const updateStatusQuery = `UPDATE RESOURCES SET Status = ? WHERE Res_id = ? AND Org_id = ?`;
    
    try {
        let notifiedUsers = [];
        let cancelledBookings = 0;

        // 1. Handle Maintenance cleanup routines safely
        if (newStatus === 'Maintenance') {
            const [affectedUsers] = await pool.execute(fetchUsersQuery, [resId, orgId]);
            notifiedUsers = affectedUsers;

            const [bookingResult] = await pool.execute(clearBookingsQuery, [resId]);
            cancelledBookings = bookingResult.affectedRows;
        }

        
        const [rows] = await pool.execute(updateStatusQuery, [newStatus, resId, orgId]);

        return {
            statusUpdated: rows.affectedRows,
            cancelledBookings: cancelledBookings,
            notifiedUsers: notifiedUsers
        };
    } catch (error) {
        console.error('Error in updateResourceStatus model:', error);
        throw error;
    }
}

export async function addCategory(catData){
    const query = `INSERT INTO RESOURCE_CATEGORY(Category_Name, Org_id, Max_Duration_Minutes) VALUES (?, ?, ?)`;
    try{
        const [rows] = await pool.execute(query, [catData.name, catData.orgId, catData.maxDuration]);
        return rows.insertId;     // Return the ID of the newly created category
    }catch(error){
        console.error('Error in addCategory:', error);
        throw error;
    }
};

export async function getResourceMaxDuration(resId) {
    const query = `
        SELECT rc.Max_Duration_Minutes, r.Res_Name 
        FROM RESOURCES r
        JOIN RESOURCE_CATEGORY rc ON r.Cat_id = rc.Cat_id
        WHERE r.Res_id = ? 
        LIMIT 1
    `;
    try {
        const [rows] = await pool.execute(query, [resId]);
        return rows[0] || null; // Returns the object containing Max_Duration_Minutes and Res_Name, or null if not found
    } catch (error) {
        console.error('Error in getResourceMaxDuration:', error);
        throw error;
    }
}

export async function deleteCategory(catId, orgId){
    const query = `DELETE FROM RESOURCE_CATEGORY WHERE Cat_id = ? AND Org_id = ?`;
    try{
        const [rows] = await pool.execute(query, [catId, orgId]);
        return rows.affectedRows;
    }catch(error){
        console.error('Error in deleteCategory:', error);
        throw error;
    }
};

export async function getCategoriesByOrg(orgId){
    const query = `SELECT Cat_id, Category_Name, Max_Duration_Minutes FROM RESOURCE_CATEGORY WHERE Org_id = ?`;
    try{
        const [rows] = await pool.execute(query, [orgId]);
        return rows;
    }catch(error){
        console.error('Error in getCategoriesByOrg:', error);
        throw error;
    }
};

export async function getResourcesByCategory(catId, orgId){
    const query = `SELECT Res_id, Res_name, Status FROM RESOURCES WHERE Cat_id = ? AND Org_id = ? AND Status != 'Archived'`;
    try{
        const [rows] = await pool.execute(query, [catId, orgId]);
        return rows;
    }catch(error){
        console.error('Error in getResourcesByCategory:', error);
        throw error;
    }
};

export async function getResourceByNameAndOrg(name, orgId) {
    const query = `SELECT * FROM RESOURCES WHERE Res_Name = ? AND Org_id = ? LIMIT 1`;
    try {
        const [rows] = await pool.execute(query, [name, orgId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error checking duplicate resource name:', error);
        throw error;
    }
}

export async function getCategoryByNameAndOrg(name, orgId) {
    const query = `SELECT * FROM RESOURCE_CATEGORY WHERE Category_Name = ? AND Org_id = ? LIMIT 1`;
    try {
        const [rows] = await pool.execute(query, [name, orgId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error checking duplicate category name:', error);
        throw error;
    }
}

/*Conflict happens when: 
1) New starts before existing ends => (start_Time(existing) < end_Time(new))


                              Start time (existing meeting)-------------------------------Endtime(existing)
start time (new meeting)-----------------------------------End time(new)

or 

2) Existing starts before new ends => (End_Time(existing) > Start_Time(new))

Start (existing) -------------------- End (existing)
             Start (new) ------------------------ End (new)

*/ 

export async function checkAvailability(resId, startTime, endTime) {
    const query = `
        SELECT * FROM BOOKINGS 
        WHERE Res_id = ? 
        AND Status = 'Confirmed'
        AND Start_Time < ? 
        AND End_Time > ?
    `;

    try {
        const [rows] = await pool.execute(query, [resId, endTime, startTime]);
        return rows.length === 0; 
    } catch (error) {
        console.error('Error in checkAvailability:', error);
        throw error;
    }
};

export async function createBooking(bookingData) {

    const query = `INSERT INTO BOOKINGS (Org_id, U_id, Res_id, Start_Time, End_Time, Status) VALUES (?, ?, ?, ?, ?, 'Confirmed')`;
    try {
        const [result] = await pool.execute(query, [bookingData.orgId, bookingData.uId, bookingData.resId, bookingData.startTime, bookingData.endTime]);
        return result.insertId;
    } catch (error) {
        console.error('Error in createBooking:', error);
        throw error;
    }
};

export async function cancelBooking(bId, uId, roleName, orgId) {
    let query;
    let params;

    const normalizedRole = roleName ? roleName.toLowerCase() : '';

    if (normalizedRole === 'admin') {
        query = `UPDATE BOOKINGS 
                 SET Status = 'Cancelled' 
                 WHERE B_id = ? AND Org_id = ? AND Status = 'Confirmed' AND End_Time > NOW()`;
        params = [bId, orgId];
    } else if (normalizedRole === 'employee') {
        query = `UPDATE BOOKINGS 
                 SET Status = 'Cancelled' 
                 WHERE B_id = ? AND U_id = ? AND Status = 'Confirmed' AND End_Time > NOW()`;
        params = [bId, uId];
    } else {

        throw new Error(`Invalid or missing role: ${roleName}`);
    }

    try {

        const [result] = await pool.execute(query, params);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in cancelBooking:', error);
        throw error;
    }
}

export async function getBookingById(bId) {
    const query = `
        SELECT B.*, R.Res_id, R.Res_name, U.Email, U.Name AS EmployeeName 
        FROM BOOKINGS B 
        LEFT JOIN RESOURCES R ON B.Res_id = R.Res_id 
        LEFT JOIN USERS U ON B.U_id = U.U_id
        WHERE B.B_id = ? 
        LIMIT 1
    `;
    try {
        const [rows] = await pool.execute(query, [bId]);
        return rows ? rows : [];
    } catch (error) {
        console.error('Error in getBookingById:', error);
        throw error;
    }
}

export async function getActiveBookingsByOrg(orgId) {
    const query = `
        SELECT 
            B.B_id AS bId,
            B.Res_id,
            R.Res_Name AS resourceName,
            U.Name AS employeeName,
            CAST(B.Start_Time AS CHAR) AS Start_Time,
            CAST(B.End_Time AS CHAR) AS End_Time,
            B.Status
        FROM BOOKINGS B
        INNER JOIN RESOURCES R ON B.Res_id = R.Res_id
        INNER JOIN USERS U ON B.U_id = U.U_id
        WHERE R.Org_id = ?
          AND B.Status = 'Confirmed'
          AND NOW() BETWEEN B.Start_Time AND B.End_Time
        ORDER BY B.End_Time ASC
    `;
    try {
        const [rows] = await pool.execute(query, [orgId]);
        return rows;
    } catch (error) {
        console.error('Error in getActiveBookingsByOrg:', error);
        throw error;
    }
};

export async function getUserBookings(uId, orgId) {
    const query = `
        SELECT B.*, R.Res_Name 
        FROM BOOKINGS B
        JOIN RESOURCES R ON B.Res_id = R.Res_id
        WHERE B.U_id = ? AND B.Org_id = ?
        ORDER BY B.Start_Time DESC`;
    try {
        const [rows] = await pool.execute(query, [uId, orgId]);
        return rows? rows : [];
    } catch (error) {
        console.error('Error in getUserBookings:', error);
        throw error;
    }
};

export async function getCurrentUserBookings(uId, orgId) {
    const query = `
        SELECT B.*, R.Res_Name 
        FROM BOOKINGS B
        JOIN RESOURCES R ON B.Res_id = R.Res_id
        WHERE B.U_id = ? 
          AND B.Org_id = ? 
          AND B.Status = 'Confirmed'    
          AND NOW() BETWEEN B.Start_Time AND B.End_Time
        ORDER BY B.End_Time ASC`;
    try {
        const [rows] = await pool.execute(query, [uId, orgId]);
        return rows ? rows : [];
    } catch (error) {
        console.error('Error in getCurrentUserBookings:', error);
        throw error;
    }
};

export async function getFutureUserBookings(uId, orgId) {
    const query = `
        SELECT B.*, R.Res_Name 
        FROM BOOKINGS B
        JOIN RESOURCES R ON B.Res_id = R.Res_id
        WHERE B.U_id = ? 
          AND B.Org_id = ? 
            AND B.Status = 'Confirmed'
          AND B.Start_Time > NOW()
        ORDER BY B.Start_Time ASC`;
    try {
        const [rows] = await pool.execute(query, [uId, orgId]);
        return rows ? rows : [];
    } catch (error) {
        console.error('Error in getFutureUserBookings:', error);
        throw error;
    }
};

export async function getLogsByOrg(orgId){
    const query = `SELECT AL.*, U.Name, O.Org_Name
                FROM AUDIT_LOGS AL
                LEFT JOIN USERS U ON AL.U_id = U.U_id
                LEFT JOIN ORGANIZATION O ON AL.Org_id = O.Org_id
                WHERE AL.Org_id = ?
                ORDER BY AL.Timestamp DESC`;
    try{
        const [rows] = await pool.execute(query, [orgId]);
        return rows;
    }catch(error){
        console.error('Error in getLogsByOrg:', error);
        throw error;
    }
};

export async function insertAuditLog(orgId, uId, action){
    const query = `INSERT INTO AUDIT_LOGS(Org_id, U_id, Action) VALUES(?, ?, ?)`;
    try{
        const [rows] = await pool.execute(query, [orgId, uId, action]);
        return rows.insertId;
    }catch(error){
        console.error('Error in insertAuditLog:', error);
        throw error;
    }
};

/*==============================================================================================================
Section 3: SuperAdmin Operations
===============================================================================================================*/

export async function  getAllOrganizationsForSuperAdmin(){
    const query = `SELECT Org_id, Org_Name, Created_At FROM ORGANIZATION ORDER BY Org_id ASC`;
    try{
        const [rows] = await pool.execute(query);
        return rows;
    }catch(error){
        console.error('Error in getAllOrganizationsForSuperAdmin:', error);
        throw error;
    }
};

export async function getGlobalSystemStatsForSuperAdmin(){
    const query = `SELECT
    (SELECT COUNT(*) FROM ORGANIZATION) as total_orgs,
    (SELECT COUNT(*) FROM USERS WHERE is_active = TRUE) as total_active_users,
    (SELECT COUNT(*) FROM RESOURCES WHERE Status != 'Archived') as total_resources`;

    try{
        const [rows] = await pool.execute(query);
        return rows[0];
    }catch(error){
        console.error('Error in getGlobalSystemStats:', error);
        throw error;
    }
};

export async function getOrgStatsForSuperAdmin(orgId){
    const query = `SELECT
    (SELECT Org_Name FROM ORGANIZATION WHERE Org_id = ?) as org_name,
    (SELECT COUNT(*) FROM USERS WHERE Org_id = ? AND is_active = TRUE) as total_org_users,
    (SELECT COUNT(*) FROM Resources WHERE Org_id = ? AND Status != 'Archived') as total_org_resources,
    (SELECT COUNT(*) FROM Bookings WHERE Org_id = ? AND Status = 'Confirmed') as total_org_bookings`;

    try{
        const [rows] = await pool.execute(query, [orgId, orgId, orgId, orgId]);
        return rows[0];     // Return the aggregated stats for the organization
    }catch(error){
        console.error('Error in getOrgStatsForSuperAdmin:', error);
        throw error;
    }

};

export async function getGlobalAuditLogsForSuperAdmin(){
    const query = `SELECT AL.Log_id as log_id, AL.U_id as user_id, AL.Action as action, AL.Timestamp as timestamp, O.Org_name as org_name, U.Name as user_name
                    FROM AUDIT_LOGS AL
                    JOIN ORGANIZATION O ON AL.Org_id = O.Org_id
                    LEFT JOIN USERS U ON AL.U_id = U.U_id
                    ORDER BY AL.Timestamp DESC
                    LIMIT 100`;     // Limit to the most recent 100 logs
    try{
        const [rows] = await pool.execute(query);
        return rows;    
    }catch(error){
        console.error('Error in getGlobalAuditLogsForSuperAdmin:', error);
        throw error;
    }

};

export async function getRecentOrgsForSuperAdmin(){
    const query = `SELECT Org_id, Org_Name FROM ORGANIZATION ORDER BY Created_At DESC LIMIT 5`;
    try{
        const [rows] = await pool.execute(query);
        return rows;
    }catch(error){
        console.error('Error in getRecentOrgsForSuperAdmin:', error);
        throw error;
    }
};


export async function getBookings(orgId){
    const query = `SELECT B.*, R.Res_Name, U.Name as user_name
                    FROM BOOKINGS B
                    JOIN RESOURCES R ON B.Res_id = R.Res_id
                    JOIN USERS U ON B.U_id = U.U_id
                    WHERE B.Org_id = ?
                    ORDER BY B.Start_Time DESC`;
    try {
        const [rows] = await pool.execute(query, [orgId]);
        return rows;
    } catch (error) {
        console.error('Error in getBookings:', error);
        throw error;
    }
};

export const getPastBookings = async (uId, orgId) => {
    const query = `
       SELECT 
    b.B_id, 
    r.Res_Name, 
    b.Start_Time, 
    b.End_Time, 
    b.Status,
    c.Category_Name
    FROM BOOKINGS b
    JOIN RESOURCES r ON b.Res_id = r.Res_id
    JOIN RESOURCE_CATEGORY c ON r.Cat_id = c.Cat_id
    WHERE b.U_id = ? 
    AND b.Org_id = ? 
    AND (b.End_Time < NOW() OR b.Status = 'Cancelled')
    ORDER BY b.Start_Time DESC`;

    try {
        const [rows] = await pool.execute(query, [uId, orgId]);
        return rows;
    } catch (error) {
        console.error("Error fetching past bookings:", error);
        throw error;
    }
};
