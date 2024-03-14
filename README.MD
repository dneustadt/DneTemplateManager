Template Manager for Shopware 6
=====

This plugin for [Shopware 6](https://www.shopware.de) features a template code editor to easily extend existing storefront
`.twig` templates.

The plugin offers the following features:

* Lists all existing template files of the default storefront
* Code editor with twig syntax highlighting for custom templates
* Displays the contents of the original template for reference
* Automatically prepends new templates with extension syntax matching the template to be extended
* Stores custom templates in filesystem within the plugins directory structure
* Languages: English, German

Requirements
-----

3.0.0
* Shopware >= 6.6

2.0.0
* Shopware >= 6.5

1.1.2
* Shopware >= 6.4

Installation
====
Clone this repository into a folder called **DneTemplateManager** within the **custom/plugins** directory of the Shopware installation.

* Install the plugin through the Plugin-Manager within the Shopware backend.

Usage
=====
The module will be accessible in backend by a new sub-menu entry called _Custom Template Manager_ under _Settings_.

Regarding proper syntax and inheritance within template extensions please see the
[official documentation](https://docs.shopware.com/en/shopware-platform-dev-en/developer-guide/storefront/templates?category=shopware-platform-dev-en/developer-guide/storefront).

Custom templates are saved in `${SHOPWARE_ROOT}/custom/plugins/.customTemplate/storefront`. It is possible to backup
or transfer the contents of that folder for use in themes or other Shopware installations.
