const express = require('express');
const router = express.Router();
const Menu = require('../models/menu');

// CREATE - Thêm mới menu
router.post('/', async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Lấy danh sách menu theo cấu trúc cha-con
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find().populate('parent');
    
    // Xây dựng cấu trúc cây
    const buildTree = (items, parentId = null) => {
      const result = [];
      for (const item of items) {
        if (String(item.parent?._id || null) === String(parentId || null)) {
          const children = buildTree(items, item._id);
          if (children.length) {
            item._doc.children = children;
          }
          result.push(item);
        }
      }
      return result;
    };

    const menuTree = buildTree(menus);
    res.json(menuTree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Lấy menu theo ID
router.get('/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate('parent');
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Cập nhật menu
router.put('/:id', async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Xóa menu
router.delete('/:id', async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    
    // Xóa các menu con
    await Menu.deleteMany({ parent: req.params.id });
    res.json({ message: 'Menu deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;