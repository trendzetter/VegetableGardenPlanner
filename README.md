[![VegetableGardenPlanner Logo](http://www.vegetablegardenplanner.org/modules/core/client/img/brand/en.png)](http://www.VegetableGardenPlanner.org/)

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/VegetableGardenPlanner/Lobby)

## Getting started
Try our [running application](http://www.VegetableGardenPlanner.org) 

## Mission statement
Our aim is to develop technology based answers to the problems of designing and maintaining vegetable gardens. Combining wisdom of the crowds and algorithms our tools aim to assist with planning through virtualization in space and time of the vegetable garden system. This allows to reduce the number of difficult choices to be made while starting and keeping a vegetable garden. The planner is used for automating the knowledge provided by users. Using the history of the vegetable garden the system improves its assistance features such as crop rotational advice. Users can share their knowledge and show off their results. Community feedback allows us to recognize authority on specific subjects, in turn motivating users to provide the community the best expertise on cultivation planning. The system provides a quick and precise view on the past which supports improved human decisions as well as experiments with cultivation practices.  
Over time our tools could expand into 3D, virtual reality and augmented reality for a more rich client experience. Open data on weather, soil and climate could be used to feed the algorithms and build a more complete virtualization. We could move into the field of robotics to build a vegetable garden maintenance robot easing the work on the vegetable garden even further and adding more sources of data for our planner using sensors on the bot.
Big issues such as internationalization still need to be addressed but our guiding principle is that when design choices need to made we try to pick the most universally applicable solution while keeping it simple enough to practically use now.

## Prerequisites for development
Make sure you have installed all of the following prerequisites on your development machine:

* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.

* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.

* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).

* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

## Downloading VegetableGardenPlanner:

### Cloning the GitHub Repository
The recommended way to get VegetableGardenPlanner is to use git to directly clone the VegetableGardenPlanner repository:

```bash
$ git clone https://github.com/trendzetter/VegetableGardenPlanner/.git VegetableGardenPlanner
```

This will clone the latest version of the VegetableGardenPlanner repository to a VegetableGardenPlanner folder.

## Quick Install
Once you've downloaded the source and installed all the prerequisites, you're just a few steps away from starting to develop VegetableGardenPlanner.

The source comes pre-bundled with a `package.json` and `bower.json` files that contain the list of modules you need to start the application.

To install the dependencies, run this in the application folder from the command-line:

```bash
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running VegetableGardenPlanner.
* When the npm packages install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application
* To update these packages later on, just run `npm update`

## Running VegetableGardenPlanner

Run VegetableGardenPlanner using npm:

```bash
$ npm start
```

VegetableGardenPlanner should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! VegetableGardenPlanner should be running. To proceed with your development, check the other sections in this documentation.
If you encounter any problems, try the Troubleshooting section.

Explore `config/env/development.js` for development environment configuration options.

### Running with User Seed
To have default account(s) seeded at runtime:

In Development:
```bash
MONGO_SEED=true npm start
```
It will try to seed the users 'user' and 'admin'. If one of the user already exists, it will display an error message on the console. Just grab the passwords from the console.

In Production:
```bash
MONGO_SEED=true npm start:prod
```
This will seed the admin user one time if the user does not already exist. You have to copy the password from the console and save it.

### Running with TLS (SSL)
Application will start by default with secure configuration (SSL mode) turned on and listen on port 8443.
To run VegetableGardenPlanner in a secure manner you'll need to use OpenSSL and generate a set of self-signed certificates. Unix-based users can use the following command:

```bash
$ npm run generate-ssl-certs
```

Windows users can follow instructions found [here](http://www.websense.com/support/article/kbarticle/How-to-use-OpenSSL-and-Microsoft-Certification-Authority).
After you've generated the key and certificate, place them in the *config/sslcerts* folder.

Finally, execute prod task `npm run start:prod`
* enable/disable SSL mode in production environment change the `secure` option in `config/env/production.js`

## Running VegetableGardenPlanner with Gulp

The VegetableGardenPlanner project integrates Gulp as build tools and task automation.

We have wrapped Gulp tasks with npm scripts so that regardless of the build tool running the project is transparent to you.

To use Gulp directly, you need to first install it globally:

```bash
$ npm install gulp -g
```

Then start the development environment with:

```bash
$ gulp
```

To run VegetableGardenPlanner with *production* environment configuration, execute gulp as follows:

```bash
$ gulp prod
```

It is also possible to run any Gulp tasks using npm's run command and therefore use locally installed version of gulp, for example: `npm run gulp eslint`

## Getting Started With VegetableGardenPlanner
You have VegetableGardenPlanner running, but there is a lot of stuff to understand. We recommend you go over the [Official Documentation](http://VegetableGardenPlanner.org/docs.html).
In the docs we'll try to explain both general concepts of and give you some guidelines to help you improve your system. We tried covering as many aspects as possible, and will keep it updated by your request.

## Community
* Use the [Official Website](http://www.VegetableGardenPlanner.org) to learn about changes.
* Ping us on [Gitter](https://gitter.im/VegetableGardenPlanner/Lobby)

## Contributing
We welcome pull requests from the community! Just be sure to read the [contributing](https://github.com/VegetableGardenPlanner/mean/blob/master/CONTRIBUTING.md) doc to get started.


## License
[AGPL3 License](LICENSE.md)
