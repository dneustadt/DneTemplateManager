<?php declare(strict_types=1);

namespace Dne\TemplateManager;

use Dne\TemplateManager\CompilerPass\ThemeLoaderCompilerPass;
use Shopware\Core\Framework\Plugin;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class DneTemplateManager extends Plugin
{
    public function build(ContainerBuilder $container): void
    {
        $container->addCompilerPass(new ThemeLoaderCompilerPass());

        parent::build($container);
    }
}
