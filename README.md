### Course project for Software Design and Analysis
This project was developed as a course project for the course Software Design and Analysis during the 2025 Winter Semester Term at Ontario Tech University. It was completed by William Wedemire (Team Lead), Bryce Gill (Technical Manager), Nathan Aguiar (Backend Developer), Tobenna Nnaobi (Frontend Developer), and Jerry Yang (Quality Assurance).

For the project, the team was tasked to develop a catalogue management system for storing and handling of physical game stock. In addition to the base catalogue, the team was also tasked to develop a search feature (with recommendations), user login feature, a stock tagging feature, revenue tracking, shipment tracking, and logging of purchases. 

Throughout the project, the team followed the software development process as taught throughout the course. This process included but was not limited to the creation and subdevision of user stories into iterations, frequent customer meetings, scrum meetings, constant updating of the team's kanban board, review and analysis of the team's velocity through the use of a burndown chart, and the use of UML diagrams to portray the inner workings of the software in an easy to understand format. 

### Building and running the project
`gradlew bootJar` builds a jar under build/libs/jar.

`gradlew bootRun` runs the project directly. Alternatively use an IDE with spring support builtin.

### Structure
`src` contains the java source, all work is under the `circuitcollective` package.


### REST
Interactive API docs are available at http://localhost:8080/swagger-ui.html once the project is running.
