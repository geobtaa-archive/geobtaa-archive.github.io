# Custom <Image> Component Documentation

This document provides instructions on how to use the custom <Image> component in this Astro project. This component is designed to give you more control over image display than standard Markdown syntax, allowing for easy resizing, alignment, and captioning.

## Features

Responsive Sizing: Control image width and height.
Flexible Alignment: Align images left, right, or center.
Semantic Captions: Easily add <figcaption> captions to your images.
Starlight Zoom Integration: Fully compatible with the starlight-image-zoom plugin.
Astro Asset Optimization: Leverages Astro's built-in asset optimization by using direct imports.

## How to Use
To use the component, you must first import it at the top of your .mdx file.

```
import Image from '../../components/Image.astro';
```

Then, you can call the component and pass it props to control its appearance.

Basic Usage
The only required props are src and alt. The recommended way to handle the src is by importing the image directly from your src/assets/ directory.

```
<Image 
  src={import('/src/assets/images/your-image.png')} 
  alt="A description of the image." 
/>
```

## Props

Here is a list of all available props for the <Image> component.

| Prop    | Type          | Default   | Description                                                       |
| ------- | ------------- | --------- | ----------------------------------------------------------------- |
| src     | ImageMetadata | string    | Required                                                          |
| alt     | string        | Required  | The alternative text for the image, crucial for accessibility.    |
| width   | string        | auto      | The width of the image (e.g., '500px', '75%').                    |
| height  |  string       | auto      | The height of the image (e.g., '300px'). Usually left as auto.    |
| align   | string        | left      | Alignment. center or right other options                          |
| caption | string        | undefined | Optional text that will be rendered as a caption below the image. |

## Examples
Sizing and Alignment
Control the width and alignment of an image.

```
<Image 
  src={import('../../assets/your-image.png')} 
  alt="A smaller, centered image." 
  width="400px"
  align="center"
/>
```

Adding a Caption
Use the caption prop to add a descriptive caption below the image. The component will automatically wrap the image and caption in the correct <figure> and <figcaption> tags.

```
    <Image 
    src={import('../../assets/your-image.png')} 
    alt="A captioned image." 
    width="600px"
    align="center"
    caption="This is a descriptive caption that appears below the image."
    />
```

Starlight Image Zoom
The component works automatically with the starlight-image-zoom plugin. No extra configuration is needed. As long as the plugin is installed, images rendered with this component will be zoomable.