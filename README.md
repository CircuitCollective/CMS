### CMS (Catalouge Managment System)

This project was developed as a course project for the course Software Design and Analysis during the 2025 Winter Semester Term at Ontario Tech University. It's main function is to serve as an inventory catalogue for a hypothetical video game distribution company. 

## Description

CMS is a basic catalogue management system that allows authorated users to add, delete, and edit video game stock stored in it's catalogue. Unauthorized users can only view items in the catalogue, and must login using the administrator username and password to become authorized. CMS offers a search function to search the catalogue, and the ability to load in inventory from a csv file. 

## Getting Started

### Dependencies

* Java 21 JDK 
* Gradle
* IDE with Spring integration (ex. InteliJ Idea) 

### Building and running the project directly
`gradlew bootJar` builds a jar under build/libs/jar.

`gradlew bootRun` runs the project directly. 

### Building and running the project using IDE
Clone master branch. 

Run `src/circuitcollective/Main.java`

Run `index.html` or connect to `http://localhost:8080`

### Structure
`src` contains the java source, all work is under the `circuitcollective` package.


### REST
Interactive API docs are available at http://localhost:8080/swagger-ui.html once the project is running.

## Authors

William Wedemire

Bryce Gill

Nathan Aguiar

Tobenna Nnaobi

Jerry Yang
