import dynamicSchemaMarkupService from './dynamicSchemaMarkupService';

const dynamicSchemaMarkupGenerationService = dynamicSchemaMarkupService as typeof dynamicSchemaMarkupService & {
  getAllGeneratedSchemas: () => ReturnType<typeof dynamicSchemaMarkupService.getAllSchemas>;
};

dynamicSchemaMarkupGenerationService.getAllGeneratedSchemas = () =>
  dynamicSchemaMarkupService.getAllSchemas();

export { dynamicSchemaMarkupGenerationService };
export default dynamicSchemaMarkupGenerationService;
