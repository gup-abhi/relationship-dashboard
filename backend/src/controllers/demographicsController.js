import {
  getPostsByField,
} from '../services/aggregationService.js';

const getAgeDistributionController = async (req, res, next) => {
  try {
    const filters = req.query;
    const ageDistribution = await getPostsByField('age_group', filters);
    res.status(200).json({ ageDistribution });
  } catch (error) {
    next(error);
  }
};

const getGenderDistributionController = async (req, res, next) => {
  try {
    const filters = req.query;
    const genderDistribution = await getPostsByField('gender', filters);
    res.status(200).json({ genderDistribution });
  } catch (error) {
    next(error);
  }
};

const getRelationshipStagesDistributionController = async (req, res, next) => {
  try {
    const filters = req.query;
    const relationshipStagesDistribution = await getPostsByField('relationship_stage', filters);
    res.status(200).json({ relationshipStagesDistribution });
  } catch (error) {
    next(error);
  }
};

const getRelationshipLengthDistributionController = async (req, res, next) => {
  try {
    const filters = req.query;
    const relationshipLengthDistribution = await getPostsByField('relationship_length', filters);
    res.status(200).json({ relationshipLengthDistribution });
  } catch (error) {
    next(error);
  }
};

export {
  getAgeDistributionController,
  getGenderDistributionController,
  getRelationshipStagesDistributionController,
  getRelationshipLengthDistributionController,
};
