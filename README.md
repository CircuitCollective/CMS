# CMS (Catalouge Managment System)

## Project Information

### Overview
This project was developed as a course project for the course Software Design and Analysis during the 2025 Winter Semester Term at Ontario Tech University. It's main function is to serve as an inventory catalogue for a hypothetical video game distribution company. 

### Description
CMS is a basic catalogue management system that allows authorized users to sign-in as an administrator to add, delete, and edit video game stock stored in it's catalogue. Unauthorized users can only view items in the catalogue, and must login using the administrator username and password to become authorized user. CMS offers a search function to search the catalogue, and the ability to load in inventory from a CSV file.
![image](https://github.com/user-attachments/assets/b9263425-56c1-402d-bafc-4682f87e01e1)

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

#### JAR Distribution
Ensure that Java 21 is installed. You can [install a copy from adoptium](https://adoptium.net/temurin/releases/?version=21) by selecting the correct OS.

Download the [latest release](https://github.com/CircuitCollective/CMS/releases/latest).

On windows double clicking the jar should work assuming that you have installed Java 21 as your default program for the .jar extension.

Otherwise, opening a terminal and running `java -jar <path>` and replacing `<path>` with the path to the jar file will boot the jar.

#### IDE
Add and run a Spring task for `Main.java` if possible. Otherwise, add and run a gradle task for `bootRun`

To run the test suite, add and run a Gradle task for `test`

### Accessing the Web-UI
Navigate to http://localhost:8080

Keep in mind that login is required for mutation of data. Currently the relevant buttons are not hidden when not logged in.

### Structure
`src` contains the java source, all work is under the `circuitcollective` package.


### REST
Interactive API docs are available at http://localhost:8080/swagger-ui.html once the project is running.

## Software Demonstration Video
https://github.com/user-attachments/assets/68e87292-e5c0-4247-9f25-0b392ef6a1a7


## Authors
- **William Wedemire**

- **Bryce Gill**

- **Tobenna Nnaobi**

- **Nathan Aguiar**

- **Jerry Yang**
