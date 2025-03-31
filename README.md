# CMS (Catalouge Managment System)

## Project Information

### Overview
This project was developed as a course project for the course Software Design and Analysis during the 2025 Winter Semester Term at Ontario Tech University. It's main function is to serve as an inventory catalogue for a hypothetical video game distribution company. 

### Description
CMS is a basic catalogue management system that allows authorized users to sign-in as an administrator to add, delete, and edit video game stock stored in it's catalogue. Unauthorized users can only view items in the catalogue, and must login using the administrator username and password to become authorized user. CMS offers a search function to search the catalogue, and the ability to load in inventory from a CSV file.

### Circuit Collective Team Associates
- **William Wedemire - *Project Manager***

- **Bryce Gill - *Technical Manager***

- **Tobenna Nnaobi - *Front-End Lead Developer***

- **Nathan Aguiar - *Back-End Lead Developer***

- **Jerry Yang - *Software Quality Assurance (SQA) Developer***


## Getting Started

### Dependencies
* Requires JDK 21
* IDE with Spring integration recommended (ex. IntelliJ IDEA) 

### Building & Running The Project
#### Command Line
##### Unix
`./gradlew bootJar` builds a jar under build/libs/jar

`./gradlew bootRun` runs the project directly

`./gradlew test` compiles if needed and runs tests
##### Windows
`gradlew.bat bootJar` builds a jar under build/libs/jar

`gradlew.bat bootRun` runs the project directly

`gradlew.bat test` compiles if needed and runs tests

#### IDE
Add a Spring task for `Main.java` if possible. Otherwise, add a gradle task for `bootRun`

Add a Gradle task for `test`

### Accessing the Web-UI
Navigate to http://localhost:8080

Keep in mind that login is required for mutation of data.

### Structure
`src` contains the java source, all work is under the `circuitcollective` package.


### REST
Interactive API docs are available at http://localhost:8080/swagger-ui.html once the project is running.

## Authors
- **William Wedemire**

- **Bryce Gill**

- **Tobenna Nnaobi**

- **Nathan Aguiar**

- **Jerry Yang**
