const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Admin
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.role = role;
  await user.save();

  res.json({ message: 'User role updated successfully' });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'Cannot delete your own account');
  }

  await user.remove();

  res.json({ message: 'User deleted successfully' });
});
