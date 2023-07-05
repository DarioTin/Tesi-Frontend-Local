const sh = require("./shell");
const utils = require('./utils')
const fs = require("fs");

async function cloneRepository(data) {
  utils.deleteGitDirectory(process.env.ROOT_PATH + "src/external/compiler/LocalExercises")
  await sh.execGitCloneCommand(data.branchName, data.url)
}

function getExerciseFilesFromLocal() {
  let files = fs.readdirSync(process.env.LOCAL_EXERCISE_FOLDER)
  let result = []
  files.forEach(file => {
    if(!file.startsWith(".")){
      result.push(file);
    }
  })
  return result
}

async function getProductionFilesFromLocal(exercise) {
  path = process.env.LOCAL_EXERCISE_FOLDER + "/" + exercise + "/" + exercise + ".java";
  return utils.readFile(path);
}

async function getTestingFilesFromLocal(exercise) {
  path = process.env.LOCAL_EXERCISE_FOLDER + "/" + exercise + "/" + exercise + "Test.java";
  return utils.readFile(path);
}

async function getConfigFilesFromLocal(exercise) {
  path = process.env.LOCAL_EXERCISE_FOLDER + "/" + exercise + "/" + exercise + "Config.json";
  return JSON.parse(utils.readFile(path));
}

module.exports = {
  cloneRepository,
  getExerciseFilesFromLocal,
  getProductionFilesFromLocal,
  getTestingFilesFromLocal,
  getConfigFilesFromLocal,
}
