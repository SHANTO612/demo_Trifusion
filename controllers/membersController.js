// controllers/membersController.js
const { db } = require("../models/db");
const { members, transactions, books } = require("../models/schema");
const { eq, and } = require("drizzle-orm");

// Register new member
const createMember = async (req, res) => {
    try {
        const { member_id, name, age, has_borrowed = false } = req.body;

        if (!member_id || !name || typeof age !== "number" || age <= 0) {
            return res.status(400).json({ message: "Invalid input" });
        }

        if (typeof has_borrowed !== "boolean") {
            return res.status(400).json({ message: "has_borrowed must be boolean" });
        }

        const existing = await db.select().from(members).where(eq(members.member_id, member_id));

        if (existing.length > 0) {
            return res.status(400).json({ message: `Member ${member_id} already exists` });
        }

        await db.insert(members).values({
            member_id,
            name,
            age,
            has_borrowed: has_borrowed ? 1 : 0,
        });

        return res.status(200).json({ member_id, name, age, has_borrowed });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

// Get member info
const getMember = async (req, res) => {
    try {
        const member_id = parseInt(req.params.member_id);
        if (isNaN(member_id)) return res.status(400).json({ message: "Invalid member_id" });

        const [member] = await db.select().from(members).where(eq(members.member_id, member_id));

        if (!member) return res.status(404).json({ message: "Member not found" });

        member.has_borrowed = !!member.has_borrowed;

        return res.status(200).json(member);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

// List all members
const listMembers = async (req, res) => {
    try {
        const allMembers = await db.select({ member_id: members.member_id, name: members.name, age: members.age }).from(members);
        return res.status(200).json({ members: allMembers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

// Update member
const updateMember = async (req, res) => {
    try {
        const member_id = parseInt(req.params.member_id);
        const { name, age, has_borrowed } = req.body;

        if (isNaN(member_id)) return res.status(400).json({ message: "Invalid member_id" });
        if (!name || typeof age !== "number" || age < 12) return res.status(400).json({ message: "Invalid age, must be 12 or older" });
        if (has_borrowed !== undefined && typeof has_borrowed !== "boolean") return res.status(400).json({ message: "has_borrowed must be boolean" });

        const [member] = await db.select().from(members).where(eq(members.member_id, member_id));
        if (!member) return res.status(404).json({ message: "Member not found" });

        const updatedHasBorrowed = has_borrowed !== undefined ? (has_borrowed ? 1 : 0) : member.has_borrowed;

        await db.update(members)
            .set({ name, age, has_borrowed: updatedHasBorrowed })
            .where(eq(members.member_id, member_id));

        return res.status(200).json({ member_id, name, age, has_borrowed: !!updatedHasBorrowed });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

// Member borrowing history
const borrowingHistory = async (req, res) => {
    try {
        const member_id = parseInt(req.params.member_id);
        if (isNaN(member_id)) return res.status(400).json({ message: "Invalid member_id" });

        const [member] = await db.select({ name: members.name }).from(members).where(eq(members.member_id, member_id));
        if (!member) return res.status(404).json({ message: "Member not found" });

        const history = await db.select({
            transaction_id: transactions.transaction_id,
            book_id: transactions.book_id,
            book_title: books.title,
            borrowed_at: transactions.borrowed_at,
            returned_at: transactions.returned_at,
            status: transactions.status,
        })
            .from(transactions)
            .leftJoin(books, eq(transactions.book_id, books.book_id))
            .where(eq(transactions.member_id, member_id));

        return res.status(200).json({ member_id, member_name: member.name, borrowing_history: history });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

// Delete member
// const deleteMember = async (req, res) => {
//     try {
//         const member_id = parseInt(req.params.member_id);
//         if (isNaN(member_id)) return res.status(400).json({ message: "Invalid member_id" });

//         const [member] = await db.select().from(members).where(eq(members.member_id, member_id));
//         if (!member) return res.status(404).json({ message: "Member not found" });

//         const [active] = await db.select().from(transactions).where(eq(transactions.member_id, member_id)).and(eq(transactions.status, "active"));
//         if (active) return res.status(400).json({ message: "Cannot delete, member has active book" });

//         await db.delete(members).where(eq(members.member_id, member_id));

//         return res.status(200).json({ message: `Member ${member_id} deleted successfully` });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "DB error" });
//     }
// };
const deleteMember = async (req, res) => {
    try {
        const member_id = parseInt(req.params.member_id);
        if (isNaN(member_id)) return res.status(400).json({ message: "Invalid member_id" });

        // Check active borrow
        const active = await db.select().from(transactions)
            .where(and(eq(transactions.member_id, member_id), eq(transactions.status, "active")));
        if (active.length > 0) return res.status(400).json({ message: `cannot delete member with id: ${member_id}, member has an active book borrowing` });

        // Delete member
        await db.delete(members).where(eq(members.member_id, member_id));
        return res.status(200).json({ message: `member with id: ${member_id} has been deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

module.exports = { createMember, getMember, listMembers, updateMember, borrowingHistory, deleteMember };
