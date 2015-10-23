'use strict';

const fs = require('fs-promise');
const path = require('path');
const filterFilenameFormatter = require('../../angularFilenameFormatters').filter;
const filterImplementationTemplate = require('./filterImplementationTemplate');
const functionDeclarationTemplate = require('../basicFunctionDefinition/functionDeclarationTemplate');
const changeIndent = require('../implementationTemplateHelpers/changeIndent');

function buildFile(options) {
    let fileDefinition = {
        parentModule: options.parentModuleRelativeLocation,
        parentModuleName: options.parentModuleName,
        name: options.name,
        dependencies: options.dependencies,
        functionImplementation: options.functionImplementation || function () { },
        type: 'filter'
    };

    let body = buildBody(fileDefinition);
    let filename = filterFilenameFormatter(options.name);
    return fs.writeFile(path.join(options.filePath, filename), body);
}

function buildBody(options) {
    // I need to : get the name, parentModule name, parentModule location, fileLocation, and function
    let sourceValues = functionDeclarationTemplate.format({
        name: options.name,
        baseFunction: options.functionImplementation
    });

    let formattedSource = changeIndent.deindentSource(sourceValues.source);

    return filterImplementationTemplate.format({
        parentModule: options.parentModule,
        parentModuleName: options.parentModuleName,
        name: options.name,
        source: formattedSource.join('\n'),
        functionName: sourceValues.name,
        dependencies: options.dependencies
    });
}

module.exports = { build: buildFile };