/**
 * Services and Categories Controllers
 */
import { marketplaceStore } from '../data/store.js';

export const getServices = (req, res) => {
  try {
    const { categoryId, search, minPrice, maxPrice, minRating } = req.query;
    const services = marketplaceStore.getServices({
      categoryId,
      search,
      minPrice,
      maxPrice,
      minRating,
    });
    return res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceById = (req, res) => {
  try {
    const service = marketplaceStore.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = (req, res) => {
  try {
    const { title, categoryId, description, price, durationEstimate, image, features } = req.body;
    if (!title || !categoryId || !price) {
      return res.status(400).json({ success: false, message: 'Title, category, and price are required' });
    }
    const newService = marketplaceStore.createService(
      { title, categoryId, description, price, durationEstimate, image, features },
      req.user.id
    );
    return res.status(201).json({ success: true, message: 'Service listed successfully', data: newService });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = (req, res) => {
  try {
    const updated = marketplaceStore.updateService(req.params.id, req.body, req.user.role === 'admin' ? null : req.user.id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    if (updated.error === 'UNAUTHORIZED') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this service' });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = (req, res) => {
  try {
    const success = marketplaceStore.deleteService(req.params.id, req.user.role === 'admin' ? null : req.user.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Service not found or unauthorized' });
    }
    return res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Categories
export const getCategories = (req, res) => {
  try {
    const categories = marketplaceStore.getCategories();
    return res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = (req, res) => {
  try {
    const { name, description, iconName, image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const cat = marketplaceStore.createCategory({ name, description, iconName, image });
    return res.status(201).json({ success: true, data: cat });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = (req, res) => {
  try {
    const updated = marketplaceStore.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = (req, res) => {
  try {
    const ok = marketplaceStore.deleteCategory(req.params.id);
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
