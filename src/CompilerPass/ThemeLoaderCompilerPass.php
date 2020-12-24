<?php declare(strict_types=1);

namespace Dne\TemplateManager\CompilerPass;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class ThemeLoaderCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        $fileSystemLoader = $container->findDefinition('twig.loader.native_filesystem');
        $projectDir = $container->getParameter('kernel.project_dir');
        $directory = $projectDir . '/custom/plugins/.customTemplate';

        if (!file_exists($directory)) {
            return;
        }

        $fileSystemLoader->addMethodCall('addPath', [$directory]);
        $fileSystemLoader->addMethodCall('addPath', [$directory, 'DneTemplateManager']);
    }
}
