<?php declare(strict_types=1);

namespace Dne\TemplateManager\Api;

use Shopware\Core\Framework\Routing\Annotation\RouteScope;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @RouteScope(scopes={"api"})
 */
class TemplateManagerController extends AbstractController
{
    /**
     * @var string|null
     */
    private $baseTemplateRoot = null;

    /**
     * @var string
     */
    private $pluginDir;

    /**
     * @var string
     */
    private $customTemplateRoot;

    public function __construct($bundles, string $projectDir)
    {
        if (!empty($bundles['Storefront'])) {
            $this->baseTemplateRoot = $bundles['Storefront']['path'] . '/Resources/views/storefront';
        }
        $this->pluginDir = $projectDir . '/custom/plugins';
        $this->customTemplateRoot = $this->pluginDir . '/.customTemplate/storefront';
    }

    /**
     * @Route("/api/v{version}/_action/dne-templatemanager/list", name="api.action.core.dne-templatemanager.list", methods={"GET"})
     */
    public function list(): JsonResponse
    {
        $data = [];

        if (!empty($this->baseTemplateRoot)) {
            $baseTemplates = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($this->baseTemplateRoot)
            );

            $data = [];

            foreach($baseTemplates as $pathName => $baseTemplate) {
                $namespace = str_replace($this->baseTemplateRoot, '', $pathName);

                if (
                    !$baseTemplate->isFile() ||
                    pathinfo($pathName, PATHINFO_EXTENSION) !== 'twig'
                ) {
                    continue;
                }

                $data[$namespace] = [
                    'id' => $namespace,
                    'name' => $namespace,
                    'custom' => 0,
                ];
            }

            if (file_exists($this->customTemplateRoot)) {
                $customTemplates = new \RecursiveIteratorIterator(
                    new \RecursiveDirectoryIterator($this->customTemplateRoot)
                );

                foreach($customTemplates as $pathName => $customTemplate) {
                    $namespace = str_replace($this->customTemplateRoot, '', $pathName);

                    if (
                        !$customTemplate->isFile() ||
                        pathinfo($pathName, PATHINFO_EXTENSION) !== 'twig'
                    ) {
                        continue;
                    }

                    $data[$namespace] = [
                        'id' => $namespace,
                        'name' => $namespace,
                        'custom' => 1,
                    ];
                }
            }

            ksort($data);
            $data = array_values($data);
        }

        return new JsonResponse($data);
    }

    /**
     * @Route("/api/v{version}/_action/dne-templatemanager/detail", name="api.action.core.dne-templatemanager.detail", methods={"POST"})
     */
    public function detail(Request $request): JsonResponse
    {
        $path = $request->get('path');
        $data = [];

        if (!empty($path)) {
            $path = str_replace(\DIRECTORY_SEPARATOR . '..', '', $path);

            if (file_exists($this->customTemplateRoot . $path)) {
                $content = file_get_contents($this->customTemplateRoot . $path);
            } else {
                $content = "{% sw_extends '@Storefront/storefront" . $path . "' %}";
            }

            $originalContent = '';
            if (file_exists($this->baseTemplateRoot . $path)) {
                $originalContent = file_get_contents($this->baseTemplateRoot . $path);
            }

            $data = [
                'path' => $path,
                'content' => $content,
                'originalContent' => $originalContent,
            ];
        }

        return new JsonResponse($data);
    }


    /**
     * @Route("/api/v{version}/_action/dne-templatemanager/save", name="api.action.core.dne-templatemanager.save", methods={"POST"})
     */
    public function save(Request $request): JsonResponse
    {
        $path = $request->get('path');
        $content = $request->get('content', '');
        $cacheWarmup = false;

        if (!empty($path)) {
            $path = str_replace(\DIRECTORY_SEPARATOR . '..', '', $path);

            $filePath = $this->customTemplateRoot . $path;

            if (pathinfo($filePath, PATHINFO_EXTENSION) === 'twig') {
                $dirname = dirname($filePath);

                if (!file_exists($this->customTemplateRoot)) {
                    $cacheWarmup = true;
                }

                if (!is_dir($dirname)) {
                    $dirParts = str_replace($this->pluginDir, '', $dirname);
                    $buildPath = rtrim($this->pluginDir, '/');
                    foreach (explode('/', $dirParts) as $dirPart) {
                        $buildPath .= '/' . $dirPart;
                        if (!is_dir($buildPath)) {
                            mkdir($buildPath, 0777, true);
                        }
                    }
                }

                file_put_contents($filePath, $content);
            }
        }

        return new JsonResponse(['success' => true, 'cacheWarmup' => $cacheWarmup]);
    }


    /**
     * @Route("/api/v{version}/_action/dne-templatemanager/delete", name="api.action.core.dne-templatemanager.delete", methods={"POST"})
     */
    public function delete(Request $request): JsonResponse
    {
        $path = $request->get('path');

        if (!empty($path)) {
            $path = str_replace(\DIRECTORY_SEPARATOR . '..', '', $path);

            $filePath = $this->customTemplateRoot . $path;
            if (file_exists($filePath) && pathinfo($filePath, PATHINFO_EXTENSION) === 'twig') {
                unlink($this->customTemplateRoot . $path);
            }
        }

        return new JsonResponse(['success' => true, 'cacheWarmup' => false]);
    }
}
