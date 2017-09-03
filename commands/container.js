// @cliDescription  Example SsscassioBoilerplate command
// Generates a "screen".

module.exports = async function (context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  const { parameters, strings, print, ignite, filesystem } = context
  const { pascalCase, isBlank } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info(`ignite generate container <name>\n`)
    print.info('A name is required.')
    return
  }

  const name = pascalCase(parameters.first)
  const containerName = name.endsWith('Container') ? name : `${name}Container`
  const props = { name: containerName }
  
  // Copies the `screen.js.ejs` in your plugin's templates folder
  // into app/screens/${name}.js.
  const jobs = [
    {
      template: 'view.js.ejs',
      target: `app/containers/${containerName}/${containerName}.js`
    },
    {
      template: 'index.js.ejs',
      target: `app/containers/${containerName}/index.js` 
    },
    {
      template: 'styles.js.ejs',
      target: `app/containers/${containerName}/styles.js` 
    }
  ]

  // make the templates and pass in props with the third argument here
  await ignite.copyBatch(context, jobs, props)

  const appNavFilePath = `${process.cwd()}/app/containers/index.js`
  const importToAdd = `import ${containerName} from './${containerName}';`
  const exportToAdd = `  ${containerName},`
  if (!filesystem.exists(appNavFilePath)) {
    const msg = `No '${appNavFilePath}' file found.  Can't insert screen.`
    print.error(msg)
    process.exit(1)
  }

  // insert screen import
  ignite.patchInFile(appNavFilePath, {
    after: '//Importação dos Containers',
    insert: importToAdd
  })

  // insert screen route
  ignite.patchInFile(appNavFilePath, {
    after: 'export {',
    insert: exportToAdd
  })

}
