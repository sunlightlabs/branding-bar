# Sunlight Branding Bar

The branding bar for Sunlight's tools and projects sits at the top of each site, and includes social media icons, an "About Sunlight" panel, and the Sunlight Foundation logo.



## Install

1. Include minified CSS and javascript for the branding bar from the CDN. The current version is `0.1.1`
    
    ```
    <link rel="stylesheet" href="https://sunlight-cdn.s3.amazonaws.com/brandingbar/0.1.1/css/brandingbar.css">
    <script src="https://sunlight-cdn.s3.amazonaws.com/brandingbar/0.1.1/js/brandingbar.min.js.gz"></script>
    ```

2. Include the icon font [SF Icons](https://github.com/sunlightlabs/sf-icons):

    ```
    <link rel="stylesheet" href="http://sf-icons.s3.amazonaws.com/css/sf-icons.css">
    ```
    If IE8 support is needed, include the following javascript as well:
    
    ```
	<!--[if IE 8]>
		<script src="http://sf-icons.s3.amazonaws.com/js/sf-icons.js"></script>
	<![endif]-->
    ```
    
    
    
## Usage

First, add this class `bb_wrapper` to your html tag:

```
<html class="bb_wrapper">
```


### Quick Setup
Ideal for *new sites* that do not already have a branding bar. This creates the contents the branding bar from a template.

1. Add this html where you want the branding bar injected:

    ```
    <div class="branding-bar" data-bb-brandingbar="true" data-bb-property-id="sunlightlabs-awesome"></div>
    ```
2. Add additional branding styles as needed.



### Custom Branding Bar
For sites that *already have* custom implementations of branding bars, to prevent conflicts.

1. Add these two data attributes `data-bb-brandingbar="true"` `data-bb-property-id="sunlightlabs-awesome"` to the root element of the existing branding bar.
    
    ```
    <div class="branding-bar" data-bb-brandingbar="true" data-bb-property-id="sunlightlabs-awesome">
        ...
    </div>
    ```

2. Include/replace the contents of the branding bar as needed. Include social media icons, branding bar toggle, and Sunlight logo.
    
    ```
    <div class="branding-bar_container">
        <div class="branding-bar_links">

            <!-- Social Media Icons -->
            <a class="social" href="https://www.facebook.com/sunlightfoundation"><span class="icon icon-facebook"></span></a>
            <a class="social" href="https://twitter.com/sunfoundation"><span class="icon icon-twitter"></span></a>
            <a class="social" href="https://plus.google.com/+sunlightfoundation"><span class="icon icon-google-plus"></span></a>
            
            <!-- Branding Bar Toggle --> 
            <a class="branding-bar_trigger" data-bb-toggle=".bb_wrapper" href="http://sunlightfoundation.com/about/">About Sunlight Foundation</a>
        </div>
        
        <!-- Sunlight Logo -->
        <div class="branding-bar_logo">
            <span class="branding-bar_productof">a product of </span>
            <a class="branding-bar_sunlight-logo" href="http://www.sunlightfoundation.com">Sunlight Foundation</a>
        </div>
    </div>
    ```

3. Add css from the default branding bar styles. Refer to [/src/css/brandingbar-default.css](https://github.com/sunlightlabs/branding-bar/blob/master/src/css/brandingbar-default.css). You may need to override global styles set by the site's stylesheets.


---

##Tips

#####CSS: To vertically center branding bar content
Set line-height of `.branding-bar_links` and `.branding-bar_logo` equal to the height of the branding bar


