[![dotnet](https://github.com/LukasMtt/LittleSimpleShop/actions/workflows/dotnet.yml/badge.svg)](https://github.com/LukasMtt/LittleSimpleShop/actions/workflows/dotnet.yml) [![angular](https://github.com/LukasMtt/LittleSimpleShop/actions/workflows/angular.yml/badge.svg)](https://github.com/LukasMtt/LittleSimpleShop/actions/workflows/angular.yml)

# Overview

**LittleSimpleShop** is a learning project that employs various techniques and technologies. It mainly serves as a training ground for me to learn, experiment and explore in order to deepen my technical and architectural understanding (_without_ the use of AI). \
The general goal is to implement a minimal Shop-/E-Commerce-Website that combines services to handle the main purpose of online shops - the display of products and the ordering process. \
Some parts of the application are worth to be extended for production use (see Issues). \
Since the main purpose of the project is to give me a playground to test out code, services, CI, dependencies and practices, I tried to cover different areas of the development process (even if it is only a minimal proof of concept), ranging from coding to testing to containerization. \
Aside from lacking features, the final step of a productive/test deployment to host the shop is not done yet and future work.

See what it looks like: ![alt text](assets/shop-tour-preview.mp4)

# Features

Using an arbitrary color scheme, the german internationalized resources and some pre-created data, we might see the following starting page:

![alt text](assets/image.png)

The website is designed in an adaptive way to scale to mobile devices:
![alt text](assets/image-1.png)

As you see, the exemplary shop ("Alices wundervoller Shop") is a pottery shop and some pictures are supplied, that show the shops product categories. \
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

... and you get an email with an invoice, which has a very basic template, but can be prettified later.

![alt text](assets/image-7.png)

# Structure and Tech

The project mainly consists of a backend (ASP .NET Core Web API) and a frontend (Angular SPA). \
The implementation includes and employs (among additional things) the following tech features and APIs:

- **Microsoft SQL Server** as a database using **EF Core** as ORM and **FluentMigrator** for migrations
- checkout workflow (only) as an anonymous user modelled as a breadcrumb path
- double submit approach for protection against CSRF to secure mutating HTTP requests (cookie and header)
- serving images and documents via the file storage system **SeaweedFS** including a creation workflow for invoices
- creating PDF invoices utilizing templating engine **Fluid** to fill a html that gets converted by the PDF converter service **Gotenberg**
- sending E-Mails using **MailKit**
- payment via interfacing the **Stripe** API - implementing a secure payment handling utilizing the Stripe payment form, using a webhook upon succeeded payment and handling a successful payment event
- setup for not yet implemented features: collecting newsletter email subscribers, presenting cookie information extendible for further use for privacy declarations, discount code, shipping provider stubs...
- source generator powered mapper **Mapperly**
- logging setup with **Serilog**
- minimal test setup (no exhaustive coverage yet) for dotnet using **NUnit** and **NSubstitute** and other packages
- various self-implemented UI elements including the checkout path, snackbar, image carousel...

Furthermore, the project includes/demonstrates:

- **Dockerfiles** for the API and the frontend
- **Docker-compose** file to start up the two developed services and the depending services (file storage and PDF converter) and the database.
- two small, basic **Github Action workflows**, that build and test the projects parts

# Run with Docker

Use the appsettings.Docker.json and app.config.docker.json for the respective projects as a base to build the Docker-images. \
Before building, you must adapt these config files if you want to fully use the shop. Most of the settings properties are suited for the setup defined by the docker-compose file, however the Stripe keys and the SMTP server properties require configuration:

- in appsettings.json, update **StripePrivateKey** and **StripeWebhookSecret** to match your keys (see https://docs.stripe.com/keys, you need a Stripe account for the setup). Use only the test (sandbox) keys for this project, since it is currently in a dev/test stage
- in appsettings.json, update the **EMail** section to match a test server setup. My tests use Papercut SMTP outside of the compose network (_host.docker.internal_) on the host machine as a toy setup to receive and see incoming messages. A mail server is currently not part of the docker compose.
- in app.config.json, update **stripePublicKey** to match your respective key (see above)

The current handling of secrets via the config files is only suited for dev and test scenarios. Prod usage requires a hardened approach via other means (secret vault...). \
Finally you can build the images:
`docker build ./ -t "shop-ng-app:latest" --no-cache` \
`docker build ./ -t "shop-api:latest" --no-cache`

Next, we need some final setup to prepare the docker compose. \
To have a working Stripe webhook, we need to listen to listen to events and forward them as a way to test the functionality locally. See https://docs.stripe.com/webhooks (under #2) and use:
`stripe listen --forward-to https://localhost:443/shop/Payment/PersistSuccessfulStripePaymentResult --log-level=debug`
This matches the exposed API service, which will be created soon. \
The API uses https, so you need to configure a cert (https://learn.microsoft.com/en-us/aspnet/core/security/docker-https?view=aspnetcore-7.0), which will be mapped as a volume into the container. You can see that an env variable is used in the compose file: **SHOP_API_PATH_TO_HTTPS**. Create that env var assigning the path to your dev cert. \
Some further adjustments should be done in the docker compose file: you should change the password of the SQL server instance. Uncomment the code to reach the server from the host machine. \
You can now run `docker compose up` in the compose files directory. At first, the API will throw an exception since the database is non existent. Connect to the database and simply create a database named **Shop**. Run `docker compose down` to stop the containers and rerun them with `docker compose up`. \
Alternatively, before running the compose up command, start up the Microsoft SQL Server with the mapped volume and create the database via the mssql console. \
You should now be able to access the SPA at http://localhost. \
Currently, no UI management for the shops actual content is available. The products and categories have to be filled in the database.

# Open ToDos

As can be seen under the issues section, there is some work to do including testing, productive deployment preparation and security hardening. \
Furthermore, feature extension ideas include an account-/login-functionality, a search function and a more fine-tuned product detail site. On top of this, the whole solution can be expanded into a more full-fledged E-commerce system, allowing to manage the contents in an UI - think of a multi-tenant approach on top, that suits the shop use case.

# License

MIT License \
Copyright (c) 2026 \
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: \
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. \
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
