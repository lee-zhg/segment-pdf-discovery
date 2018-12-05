
# Steps

Complete the steps below.

## Before you begin

* Create an IBM Cloud account -- [Sign up](https://console.bluemix.net/registration/) for IBM Cloud, or use an existing account. Your account must have available space for at least one app and two Watson services.

* Make sure that you have the following prerequisites installed:
    * The [Node.js](https://nodejs.org/#download) runtime, including the [NPM](https://www.npmjs.com) package manager.
    * The [Cloud Foundry](https://github.com/cloudfoundry/cli#downloads) CLI.

## Setting up Assistant service

The Watson Assistant service is used to provide underline infrastructure for the virtual agent in this code pattern.

### Creating an Assistant service

Watson Assistant service is to be setup to simulate help desk level 1 activities. For topics that the virtual agent has been trained, it can help end users interactively. For subjects that the virtual agent does not understand, it searches the knowledge base through Discovery service, collects information from end user and creates a new ticket in back-office ticketing system, for example Maximo/ICD, if necessary.

Slots are configured in the Assistant service to collect additional information from end users.

1. At the command line, go to the local project directory (`vaticketbot`).

1. Connect to IBM Cloud with the Cloud Foundry command-line tool. For more information, see the [IBM Cloud documentation](https://console.bluemix.net/docs/cli/reference/cfcommands/index.html).
    ```bash
    cf login
    ```

1. Create an instance of the Assistant service in IBM Cloud. For example:

    ```bash
    cf create-service conversation free my-conversation-service
    ```

### Importing the Assistant workspace

1. In your browser, navigate to the [IBM Cloud console](https://console.ng.bluemix.net/dashboard/services).

1. From the **All Items** tab, click the newly created Assistant service in the `Cloud Foundry Services` list.

1. On the next page, click `Launch tool`.

1. In the Watson Assistant page, navigate to `Workspace` tab.

1. Click the `Import workspace` icon on the top of the Assistant workspaces. 

1. Specify the location of the workspace JSON file in your local copy of the app project:

    `<project_root>/training/ITSM_workspace.json`

1. Select `Everything (Intents, Entities, and Dialog)` option and then click `Import`. 

1. The sample ITSM workspace is created.

## Setting up Discovery service

The Watson Discovery service is used to provide underline infrastructure in this code pattern when searching in knowledge base.

### Creating a Discovery service

Watson Discovery service is to be setup to search in the knowledge base when the virtual agent is not trained to cover specific topics.

1. At the command line, go to the local project directory (`vaticketbot`).

1. Connect to IBM Cloud with the Cloud Foundry command-line tool. 
    ```
    cf login
    ```

1. Create an instance of the Discovery service in IBM Cloud. For example:

    ```bash
    cf create-service discovery lite my-discovery-service
    ```

1. Check the status of Discovery service instance in IBM Cloud, if necessary

    ```bash
    cf services
    ```

### Creating a collection and ingesting documents into Discovery service

1. Download and unzip the [`knowledgebase.zip`](training/knowledgebase.zip) in this repo to reveal a set of JSON documents

1. Navigate to your Discovery instance in your IBM Cloud dashboard

1. Click `Launch tool`

1. Create a new data collection, name it whatever you like, and select the default configuration.

1. After you're done, a new private collection is displayed in the UI  

1. Click `Drag and drop your documents here or browse from computer` section

1. Select three JSON files from local file system where you downloaded and unzipped `knowledgebase.zip` file. This may take a few seconds, you will see a notification when the process is finished

## Setting up trial IBM Control Desk SaaS system

If you don't have an available in-house Maximo/ICD system to integrate with Watson services in this code pattern, you may request a trial ICD SaaS system.

You may request a [trial ICD SaaS system](https://www.ibm.com/us-en/marketplace/it-service-management) at no cost. Click the `Free 30-day trial` link and follow the procedure. It may take a while for the system orchestration to complete.

After the trial ICD SaaS system is active, you should receive an email for your trial ICD system.

    Thank you for requesting IBM Control Desk on Cloud. Your trial is now ready for you to start using.

    The Products and Services page provides access to all of your trials and subscriptions, and includes additional information to help you get started,as well as information for product support. This would be a good link to bookmark!

    Your trial is valid through Sun, 22 Apr 2018 02:09 UTC. 
    
    Enjoy your trial to IBM Control Desk on Cloud!
 
    Sincerely,
    IBM Marketplace Team 

Click [Products and Services](https://myibm.ibm.com/products-services/) link in the email to navigate to your Products and service home page. One of trial offers is `IBM Control Desk on Cloud Trial`.

Click `Manage` button to review the Overview page of your trial ICD system. In the navigation pane on the left, select `Usage instructions`.

Default account information is displayed on `Usage instructions` page. Take a note of password for maxadmin account for further code pattern configuration.

    Your trial is predefined with demo data and several sign in IDs that you can use to see how IBM Control Desk is tailored for different types of users. When logging in to IBM Control Desk, use one of the following user IDs and use the password sNzuxX7S for all IDs.

        bob - End user (originates tickets, service requests, and catalog requests)
        scott - Service Desk Agent (handles service requests, incidents, and problems)
        franklin - Change Manager (works with changes, releases, and the configuration management database)
        jake - Asset Manager (handles hardware and software assets)
        maxadmin - Super user (has full administrative rights)    

click `Launch` button to bring up ICD login screen. Note down the login page URL for late configuration. For example, 
    
    https://siwr35cdwsa-tr3.sccd.ibmserviceengage.com/maximo_t4hj/webclient/login/login.jsp?welcome=true

Login to your trail ICD SaaS system and verify it's working.

