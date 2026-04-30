const navigationService = require('./navigation/navigation.service');
const folderService = require('./folders/folder.service');
const fileService = require('./files/file.service');
const systemService = require('../system/services/system.service');
const machineService = require('../machine/services/machine.service');

module.exports = {
				setMode: navigationService.setMode,

				changeDirectory: navigationService.changeDirectory,
				goBack: navigationService.goBack,

				listSpecific: folderService.listSpecific,
				listDetailed: folderService.listDetailed,

				createFolder: folderService.createFolder,
				createFile: fileService.createFile,

				deleteFolder: folderService.deleteFolder,
				deleteFile: fileService.deleteFile,

				getSystemConfig: systemService.getSystemConfig,
				getMachineInfo: machineService.getMachineInfo,

				startCommand: navigationService.startCommand
};