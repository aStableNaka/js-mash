// How the fuck does this even work

const crypto = require('crypto');
const fs = require("fs");
var hash;

var argv = process.argv,
	cwd = argv[2]?argv[2]:process.cwd(),
	libPath = argv[3],
	versionsPath = cwd+"/build/legacy/",
	buildPath = cwd+"/build/";
	
var getBuildFile = function(){
	return String(fs.readFileSync( buildPath + "build.bp" ));
}

String.prototype.replaceAll = function( query, replacement ){
	var self = this;
	return self.split( query ).join( replacement );
};

var buildInstructions = getBuildFile().replaceAll("\t", "").replaceAll("\r\n", "\n");

var parseLines = function(){
	return buildInstructions.split("\n");
}

var instructionLines = parseLines();

var instructioninstructionPairs = instructionLines.map(( instructionPair )=>{
	var instructionPair = instructionPair.split(" ");
	if(instructionPair.length>=2){
		instructionPair[0] = instructionPair[0].charCodeAt(0);
	}else{
		instructionPair = ["42",""];
	}
	
	return instructionPair;
});

var buffer = "";
var files = []
var lines = 0;
var stats = {
	merged:0,
	created:0,
	chars:0,
	lines:0,
	libraries:0,
	libList:[],
	calls:files,
	ver:"0.0.1"
}
var lintout = {};

var execute = function(){
	if( !fs.existsSync( versionsPath ) ){
		fs.mkdirSync( versionsPath );
	}
	instructioninstructionPairs.map( ( instructionPair )=>{
		protoCall( instructionPair );
	} );
	
	//lint();
}





var discrepencyCheck = function( instructionPair, buffer ){
	var versPath = `${versionsPath}${instructionPair[1]}`,
		vrDirs = fs.readdirSync( versionsPath ).filter( (file)=>{
			return file.includes(instructionPair[1]);
		});
		
		// Determine current file hash
		hash = crypto.createHash("sha256");
		hash.update(buffer);
		var fpDigest = hash.digest("hex");
		
		// Find most recent file
		var lastFile = vrDirs[vrDirs.length-1],
			lastFilePath = `${versionsPath}${lastFile}`;
		if( !lastFile ){
			return false
		}

		hash = crypto.createHash("sha256");
		hash.update(fs.readFileSync( lastFilePath ));
		var lsDigest = hash.digest("hex");
		
		return fpDigest == lsDigest;
}









/**
	#### PROTOCOLS ####
*/

var protoAppendAnalyticsToFile = function(){
	buffer+=`const JSBUILDER_ANALYTICS=JSON.parse( '${JSON.stringify( stats )}\' );`;
}

var protoAppendSourceToBuffer = function( instructionPair, path, callback ){
	path = path?path : cwd;
	var read = fs.readFileSync( `${path}/${instructionPair[1]}` ).toString()+"\n\n";
	
	buffer+=`/* File source: ${path}/${instructionPair[1]} */\n` + read;
	files.push( [ read.split("\n").length, instructionPair[1] ] );
	
	stats.merged++;
	callback?callback():null;
}

var protoAppendLibraryToBuffer = function( instructionPair ){
	protoAppendSourceToBuffer( instructionPair, libPath, ()=>{
		stats.libraries++;
		stats.libList.push(instructionPair[1]);
	})
	var read = fs.readFileSync( `${libPath}/${instructionPair[1]}` )+"\n\n";
}

var protoFinishBuffer = function( instructionPair ){
	var filePath = `${cwd}/build/${instructionPair[1]}`
	if(fs.existsSync( filePath )){
		if( !discrepencyCheck( instructionPair, buffer )){
			console.log(`!Found file discrepency ${instructionPair[1]}`);
			//fs.copyFileSync( filePath, `${versionsPath}/${(new Date().getTime())}.${instructionPair[1]}`);
		}
	}
	fs.writeFileSync( filePath, buffer );
	stats.chars+=buffer.length;
	stats.lines+=buffer.split("\n").length;
	stats.created++;
	
	console.log(JSON.stringify(stats));
	
	buffer = "";
}

function protoPrintStats(){

}






var protocols = {
	"94":{ l: "\u001b[0mAdd library", p: protoAppendLibraryToBuffer },
	"43":{ l: "\u001b[0mAdd source file", p: protoAppendSourceToBuffer },
	"61":{ l: "\u001b[32mFlush to file\u001b[0m", p: protoFinishBuffer },
	"42":{ l: "\u001b[0mnull", p: ()=>{} },
	"115":{ l: "\u001b[0mBatch with analytics", p: protoAppendAnalyticsToFile }
}


var protoCall = function ( instructionPair ){
	if(parseInt(instructionPair[0])!=42){
		console.log( `${protocols[instructionPair[0]].l} ${instructionPair}` );
	}
	protocols[instructionPair[0]].p( instructionPair );
}
execute();