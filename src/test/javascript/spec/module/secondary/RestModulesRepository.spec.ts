import { RestModules, RestModulesRepository, RestModuleProperties } from '@/module/secondary/RestModulesRepository';
import { dataBackendResponse, stubAxiosHttp } from '../../http/AxiosHttpStub';
import { defaultModules, defaultModuleToApply } from '../domain/Modules.fixture';

describe('Rest modules repository', () => {
  it('Should list modules using axios', async () => {
    const axiosInstance = stubAxiosHttp();
    const repository = new RestModulesRepository(axiosInstance);
    axiosInstance.get.resolves(dataBackendResponse(restModules()));

    const modules = await repository.list();

    expect(modules).toEqual(defaultModules());
  });

  it('Should get module without properties', async () => {
    const axiosInstance = stubAxiosHttp();
    const repository = new RestModulesRepository(axiosInstance);
    axiosInstance.get.resolves(dataBackendResponse(restModulesWithoutProperties()));

    const modules = await repository.list();

    expect(modules.categories[0].modules[0].properties).toEqual([]);
  });

  it('Should apply modules using axios', async () => {
    const axiosInstance = stubAxiosHttp();
    const repository = new RestModulesRepository(axiosInstance);
    axiosInstance.post.resolves(dataBackendResponse(null));

    await repository.apply('module', defaultModuleToApply());

    expect(axiosInstance.post.calledOnce).toBe(true);
  });

  it('Should get applied modules using axios', async () => {
    const axiosInstance = stubAxiosHttp();
    const repository = new RestModulesRepository(axiosInstance);
    axiosInstance.get.resolves(dataBackendResponse([{ serviceId: 'spring-cucumber' }]));

    const appliedModules = await repository.appliedModules('test');

    expect(appliedModules).toEqual(['spring-cucumber']);
  });

  it('Should download project using axios', async () => {
    const axiosInstance = stubAxiosHttp();
    const repository = new RestModulesRepository(axiosInstance);
    axiosInstance.get.resolves({ headers: { 'x-suggested-filename': 'file.zip' }, data: [1, 2, 3] });

    const project = await repository.download('path/to/project');

    expect(axiosInstance.get.lastCall.args[0]).toBe('/api/projects?path=path/to/project');
    expect(project.filename).toBe('file.zip');
    expect(project.content).toEqual([1, 2, 3]);
  });
});

const restModules = (): RestModules => ({
  categories: [
    {
      name: 'Spring',
      modules: [
        {
          slug: 'spring-cucumber',
          description: 'Add cucumber to the application',
          properties: restModuleProperties(),
          tags: ['server'],
        },
        {
          slug: 'banner',
          description: 'Add a banner to the application',
        },
      ],
    },
  ],
});

const restModulesWithoutProperties = (): RestModules => ({
  categories: [
    {
      name: 'Spring',
      modules: [
        {
          slug: 'spring-cucumber',
          description: 'Add cucumber to the application',
        },
      ],
    },
  ],
});

const restModuleProperties = (): RestModuleProperties => ({
  definitions: [
    {
      type: 'STRING',
      mandatory: true,
      key: 'baseName',
      description: 'Application base name',
      example: 'jhipster',
    },
    {
      type: 'BOOLEAN',
      mandatory: false,
      key: 'optionalBoolean',
    },
    {
      type: 'INTEGER',
      mandatory: false,
      key: 'optionalInteger',
    },
  ],
});
