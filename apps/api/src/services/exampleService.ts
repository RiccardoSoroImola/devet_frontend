export const exampleService = {
  getExampleData: async () => {
    // This is a placeholder service
    // Replace with actual business logic
    return {
      message: 'Example data from service',
      timestamp: new Date().toISOString(),
    };
  },

  createExampleData: async (data: unknown) => {
    // This is a placeholder service
    // Replace with actual business logic
    // Note: For production use, consider using a proper UUID library
    return {
      message: 'Data created successfully',
      data,
      id: Math.random().toString(36).substring(2, 11),
    };
  },
};
