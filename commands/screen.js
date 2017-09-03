// @cliDescription  Example SsscassioBoilerplate command
// Generates a "screen".

module.exports = async function (context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  const { parameters, strings, print, ignite, filesystem } = context
  const { pascalCase, isBlank } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info(`ignite generate screen <name>\n`)
    print.info('A name is required.')
    return
  }

  const name = pascalCase(parameters.first)
  const screenName = name.endsWith('Screen') ? name : `${name}Screen`
  const props = { name: screenName }
  
  // Copies the `screen.js.ejs` in your plugin's templates folder
  // into app/screens/${name}.js.
  const jobs = [
    {
      template: 'view.js.ejs',
      target: `app/screens/${screenName}/${screenName}.js`
    },
    {
      template: 'index.js.ejs',
      target: `app/screens/${screenName}/index.js` 
    },
    {
      template: 'styles.js.ejs',
      target: `app/screens/${screenName}/styles.js` 
    }
  ]

  // make the templates and pass in props with the third argument here
  await ignite.copyBatch(context, jobs, props)

  const appNavFilePath = `${process.cwd()}/app/router.js`
  const importToAdd = `import ${screenName} from './screens/${screenName}';`
  const routeToAdd = `  ${(screenName.slice(0, -6)).toLowerCase()}: ()=> ${screenName},`

  if (!filesystem.exists(appNavFilePath)) {
    const msg = `No '${appNavFilePath}' file found.  Can't insert screen.`
    print.error(msg)
    process.exit(1)
  }

  // insert screen import
  ignite.patchInFile(appNavFilePath, {
    after: 'import { createRouter }',
    insert: importToAdd
  })

  // insert screen route
  ignite.patchInFile(appNavFilePath, {
    after: 'const Router = c',
    insert: routeToAdd
  })

}
