package tech.jhipster.lite.generator.server.javatool.base.domain;

import static tech.jhipster.lite.common.domain.FileUtils.getPath;
import static tech.jhipster.lite.generator.project.domain.Constants.MAIN_JAVA;
import static tech.jhipster.lite.generator.project.domain.Constants.TEST_JAVA;
import static tech.jhipster.lite.generator.project.domain.DefaultConfig.PACKAGE_NAME;

import tech.jhipster.lite.generator.project.domain.DefaultConfig;
import tech.jhipster.lite.generator.project.domain.Project;
import tech.jhipster.lite.generator.project.domain.ProjectRepository;

public class JavaBaseDomainService implements JavaBaseService {

  public static final String SOURCE = "server/javatool/base";

  private final ProjectRepository projectRepository;

  public JavaBaseDomainService(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  @Override
  public void addJavaBase(Project project) {
    project.addDefaultConfig(PACKAGE_NAME);
    String packageNamePath = project.getPackageNamePath().orElse(DefaultConfig.PACKAGE_PATH);
    String errorDomainPath = "error/domain";

    JavaBase
      .errorDomainFiles()
      .forEach(file -> projectRepository.template(project, SOURCE, file, getPath(MAIN_JAVA, packageNamePath, errorDomainPath)));

    JavaBase
      .errorDomainTestFiles()
      .forEach(file -> projectRepository.template(project, SOURCE, file, getPath(TEST_JAVA, packageNamePath, errorDomainPath)));

    JavaBase.annotationsFiles().forEach(file -> projectRepository.template(project, SOURCE, file, getPath(TEST_JAVA, packageNamePath)));
  }
}
