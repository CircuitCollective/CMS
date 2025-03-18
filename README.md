### CMS (Catalouge Managment System)

This project was developed as a course project for the course Software Design and Analysis during the 2025 Winter Semester Term at Ontario Tech University. It's main function is to serve as an inventory catalogue for a hypothetical video game distribution company. 

## Description

CMS is a basic catalogue management system that allows authorated users to add, delete, and edit video game stock stored in it's catalogue. Unauthorized users can only view items in the catalogue, and must login using the administrator username and password to become authorized. CMS offers a search function to search the catalogue, and the ability to load in inventory from a csv file. 

## Getting Started

### Dependencies
* Requires JDK 21
* IDE with Spring integration recommended (ex. IntelliJ IDEA) 

### Building & Running the project
#### Command line
##### Unix
`./gradlew bootJar` builds a jar under build/libs/jar

`./gradlew bootRun` runs the project directly
##### Windows
`gradlew.bat bootJar` builds a jar under build/libs/jar

`gradlew.bat bootRun` runs the project directly

#### IDE
Add a Spring task for `Main.java` if possible. Otherwise, add a gradle task for `bootRun`

### Accessing the web-ui
Navigate to http://localhost:8080

Keep in mind that login is required for mutation of data.

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
