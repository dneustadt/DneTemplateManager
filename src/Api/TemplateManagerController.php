<?php declare(strict_types=1);

namespace Dne\TemplateManager\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: ['_routeScope' => ['administration']])]
class TemplateManagerController extends AbstractController
{
    private ?string $baseTemplateRoot = null;

    private string $pluginDir;

    private string $customTemplateRoot;

    private bool $isDocumentRequest;

    public function __construct($bundles, string $projectDir, RequestStack $requestStack)
    {
        $this->isDocumentRequest = $requestStack->getCurrentRequest() && $requestStack->getCurrentRequest()->get('documents') !== null;

        if (!empty($bundles['Storefront']) && !$this->isDocumentRequest) {
            $this->baseTemplateRoot = $bundles['Storefront']['path'] . '/Resources/views/storefront';
        }
        if (!empty($bundles['Framework']) && $this->isDocumentRequest) {
            $this->baseTemplateRoot = $bundles['Framework']['path'] . '/Resources/views/documents';
        }

        $this->pluginDir = $projectDir . '/custom/plugins';
        $customTemplateBase = $this->isDocumentRequest ? 'documents' : 'storefront';
        $this->customTemplateRoot = $this->pluginDir . '/.customTemplate/' . $customTemplateBase;
    }

    #[Route(path: '/api/_action/dne-templatemanager/list', name: 'api.action.core.dne-templatemanager.list', methods: ['GET'])]
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

    #[Route(path: '/api/_action/dne-templatemanager/detail', name: 'api.action.core.dne-templatemanager.detail', methods: ['POST'])]
    public function detail(Request $request): JsonResponse
    {
        $path = $request->get('path');
        $data = [];

        if (!empty($path)) {
            $path = str_replace(\DIRECTORY_SEPARATOR . '..', '', $path);

            $isCustom = 0;
            $customPath = $this->customTemplateRoot . $path;
            if (file_exists($customPath) && pathinfo($customPath, PATHINFO_EXTENSION) === 'twig') {
                $content = file_get_contents($customPath);
                $isCustom = 1;
            } elseif ($this->isDocumentRequest) {
                $content = "{% sw_extends '@Framework/documents" . $path . "' %}";
            } else {
                $content = "{% sw_extends '@Storefront/storefront" . $path . "' %}";
            }

            $originalContent = '';
            $originalPath = $this->baseTemplateRoot . $path;
            if (file_exists($originalPath) && pathinfo($originalPath, PATHINFO_EXTENSION) === 'twig') {
                $originalContent = file_get_contents($originalPath);
            }

            $data = [
                'path' => $path,
                'content' => $content,
                'originalContent' => $originalContent,
                'custom' => $isCustom,
            ];
        }

        return new JsonResponse($data);
    }

    #[Route(path: '/api/_action/dne-templatemanager/save', name: 'api.action.core.dne-templatemanager.save', methods: ['POST'])]
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

    #[Route(path: '/api/_action/dne-templatemanager/delete', name: 'api.action.core.dne-templatemanager.delete', methods: ['POST'])]
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
