import { exampleService } from '../services/exampleService';

describe('Example Service', () => {
  it('should return example data', async () => {
    const data = await exampleService.getExampleData();
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('timestamp');
  });

  it('should create example data', async () => {
    const input = { name: 'test' };
    const result = await exampleService.createExampleData(input);
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('data');
    expect(result.data).toEqual(input);
  });
});
