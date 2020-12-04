Template Manager for Shopware 6
=====
[![Donate](https://www.paypalobjects.com/en_US/DK/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=88UMDD53QSYK6&source=url)

This plugin for [Shopware 6](https://www.shopware.de) features a template code editor to easily extend existing storefront
`.twig` templates.

_If you want to buy me a cup of coffee or support the development of this free extension, feel free to donate :)_

The plugin offers the following features:

* Lists all existing template files of the default storefront
* Code editor with twig syntax highlighting for custom templates
* Displays the contents of the original template for reference
* Automatically prepends new templates with extension syntax matching the template to be extended
* Stores custom templates in filesystem within the plugins directory structure
* Languages: English, German

Requirements
-----

1.0.0
* Shopware >= 6.3

Installation
====
Clone this repository into a folder called **DneTemplateManager** within the **custom/plugins** directory of the Shopware installation.

* Install the plugin through the Plugin-Manager within the Shopware backend.

Usage
=====
The module will be accessible in backend by a new menu entry called _Custom Template Manager_.

Regarding proper syntax and inheritance within template extensions please see the
[official documentation](https://docs.shopware.com/en/shopware-platform-dev-en/developer-guide/storefront/templates?category=shopware-platform-dev-en/developer-guide/storefront).

Custom templates are saved in `${SHOPWARE_ROOT}/custom/plugins/.customTemplate/storefront`. It is possible to backup
or transfer the contents of that folder for use in themes or other Shopware installations.
