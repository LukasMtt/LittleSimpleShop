[![dotnet](https://github.com/LukasMtt/LittleSimpleShop/actions/workflows/dotnet.yml/badge.svg)](https://github.com/LukasMtt/LittleSimpleShop/actions/workflows/dotnet.yml) [![angular](https://github.com/LukasMtt/LittleSimpleShop/actions/workflows/angular.yml/badge.svg)](https://github.com/LukasMtt/LittleSimpleShop/actions/workflows/angular.yml)

# Overview

LittleSimpleShop is a learning-project that employs various techniques and technologies. It mainly serves as a training ground for me to learn, experiment and explore in order to deepen my technical understanding (_without_ the use of AI). \
The general goal is to implement a minimal Shop-/E-Commerce-Website that combines services to handle the presentation of products and the ordering process. Some parts of the application are meant to be extended (see Issues). \
Since the main purpose of the project is to give me a playground to test out code, services, CI and practices, I tried to cover different areas of the development process (even if it is only a minimal proof of concept). \
Aside from lacking features, the final step of a productive/test deployment is not done and not prepared yet.

# Features

Using an arbitrary color scheme and the german internationalized resources, we might get that starting page:
![alt text](assets/image.png)
Mobile:
![alt text](assets/image-1.png)
As you see, the exemplary shop ("Alices wundervoller Shop") is a pottery shop, some pictures are supplied. \
Within the product show sites, we have some basic actions and product infos:
![alt text](assets/image-2.png)
The checkout process is modelled as a breadcrumb path, collecting address info and redirecting to stripe:
![alt text](assets/image-3.png)
... supply address info and shipping info ...
![alt text](assets/image-4.png)
... you are redirected to the stripe payment form if you process further ...
![alt text](assets/image-5.png)
After a successful checkout, you can track your order...
![alt text](assets/image-6.png)
... and you get an email with an invoice, which has a very basic template, but can be prettified.
![alt text](assets/image-7.png)

# Structure and Tech

# Run with Docker

# ToDo's and open issues

# License

MIT License
Copyright (c) 2026
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
