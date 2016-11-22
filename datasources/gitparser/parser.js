﻿/*
* Copyright (c) TUT Tampere University of Technology 2014-2015.
* All rights reserved.
* This software has been developed in Tekes-TIVIT project Need-for-Speed.
* All rule set in consortium agreement of Need-for-Speed project apply.
*
* Main authors: Otto Hylli
*/

// this file offers a command line interface for the github parser
// it uses the appropriate linker or parser method based on the user input

var gitHubParser = require('./githubparser.js');
var gitHubLinker = require( './githublinker.js' );

// get commandline arguments: command, username, repository name (required) and OAuth token (optional)
var command = process.argv[2];
var user = process.argv[3];
var repo = process.argv[4];
var token = process.argv[5];

if ( !command || !user || !repo ) {
    console.log( "Give a command, the owner's username and the name of a Github repository as command line arguments." );
    return;
}

var config = { user: user, repo: repo, token: token };
if ( command == 'commits' ) {
    gitHubParser.parseCommits( config, function( err, result ) { 
        if ( err ) {
            console.log( "An error occurred with message:" );
            console.log( err.message );
        }
    
        console.log( result.count +" commits fetched. Added " +result.addedCount +" to database. Failed to add " +result.failedCount +"." );
        console.log('A total of '+ result.commitChanges +' commits were updated successfully while '+ result.failedCommitChanges +' failed.');
    });
}

else if ( command == 'issues' ) {
    gitHubParser.parseIssues( config, function ( err, result ) {
        if ( err ) {
            console.log( "An error occurred:" );
            console.log( err.message );
        }
        
        console.log( result.count +" items to be created. " +result.addedCount +" added. Failed to add " +result.failedCount +"." );
        console.log( result.linkCount +" items to be linked of which " + result.commentLinks + " are comments. Linked " +result.linked +". Failed to link " +result.failedLinks +"." );
        console.log( result.eventIds.length +" events created." );
        console.log( result.commentIds.length +" comments created." );
        console.log( result.constructIds.length +" constructs created." );
    });
}

else if ( command == 'link' ) {
    console.log( 'started ', Date() );
    gitHubLinker.link( config, function ( err, result ) {
         if ( err ) {
             console.log( "an error occurred: " );
             console.log( err.message );
         }
         
         console.log( 'Finished ', Date() );
         console.log( result.constructIds.length +" constructs created." );
         console.log( result.eventIds.length +" events created." );
         console.log( result.commentIds.length +" comments created." );
    });
}

else {
    console.log( "Unrecognized command. Accepted commands are commits, issues or link." );
}