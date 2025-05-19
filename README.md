**Task Manager Application**

**Overview**

The Task Manager application is built using Zoho Catalyst NoSQL DB to manage tasks efficiently. It allows users to add, filter, edit, and delete tasks while ensuring data is stored and retrieved effectively from the NoSQL database.

Development URL -  https://reactincatalyst-860829830.development.catalystserverless.com/app/index.html

**Features**

**Add Tasks:** Users can create tasks by providing the following details:
* User ID
* Task Name
* Due Date
* Priority
* Status

**Filter Tasks:**

 Users can filter tasks using:
 
* User ID (Partition Key)
* Task Name (Sort Key)
* Status

* Tasks can be retrieved using User ID and Task Name (matching keys).

* Tasks can also be retrieved using only User ID via indexing, where User ID is the Partition Key.

* **Edit & Delete Tasks**: Users can update or delete tasks, and changes will be reflected in the NoSQL database in real-time.

* **CRUD Operations**: Backend operations are handled using **Zoho Catalyst NoSQL SDK methods** to ensure smooth data management.



**Step 1:-**
Create a project in the Catalyst console


**Step 2:** Creating the NoSQL Table

1. Create a table in Zoho Catalyst NoSQL database

    * Provide a name for the table.
    * Set UserID as the Partition Key with datatype: String.
    * Enable Sort Key, then set TaskName as the Sort Key with datatype: String.
    * Click Create.

1. Adding Indexes

    * Click Add Indexes.
    * Set UserID as the Partition Key with datatype: String.
    * Set Sort Key to NO.
    * Click Create.

Now, the table is created with UserID as the Partition Key and TaskName as the Sort Key.

**Step 3:-** Initialize the Catalyst Project in CLI

1. Before initializing the Catalyst project, install the latest beta version of the Catalyst CLI using the following command:

* npm install -g zcatalyst-cli@beta

Then, kindly nsure you are using the beta 
   
2. Once installed, initialize the Catalyst project in your terminal using the catalyst init command. You can refer to the official documentation for initializing functions and client applications.

* For functions, select Advanced I/O Function.
* For the client, select React App.

3. After successfully initializing the project, create the required files and paste the corresponding code from the provided GitHub repository into the respective files.

4. Once all the files are created and the code is copied, test your application locally using the following command:

* catalyst serve

5. If the application runs successfully in your local environment, deploy it using the following command:

* catalyst deploy

Now, using the generated development URL, you can access your application in the browser.
