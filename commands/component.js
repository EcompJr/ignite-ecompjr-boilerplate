// @cliDescription  Example SsscassioBoilerplate command
// Generates a "component".

module.exports = async function (context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  const { parameters, strings, print, ignite, filesystem } = context
  const { pascalCase, isBlank } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info(`ignite generate component <name>\n`)
    print.info('A name is required.')
    return
  }

  const name = pascalCase(parameters.first)
  const componentName = name;
  const props = { name: componentName }
  
  // Copies the `component.js.ejs` in your plugin's templates folder
  // into app/components/${name}.js.
  const jobs = [
    {
      template: 'view.js.ejs',
      target: `app/components/${componentName}/${componentName}.js`
    },
    {
      template: 'index.js.ejs',
      target: `app/components/${componentName}/index.js` 
    },
    {
      template: 'styles.js.ejs',
      target: `app/components/${componentName}/styles.js` 
    }
  ]

  // make the templates and pass in props with the third argument here
  await ignite.copyBatch(context, jobs, props)

  const appNavFilePath = `${process.cwd()}/app/components/index.js`
  const importToAdd = `import ${componentName} from './${componentName}';`
  const exportToAdd = `  ${componentName},`
  if (!filesystem.exists(appNavFilePath)) {
    const msg = `No '${appNavFilePath}' file found.  Can't insert screen.`
    print.error(msg)
    process.exit(1)
  }

  // insert screen import
  ignite.patchInFile(appNavFilePath, {
    after: '//Importação dos Components',
    insert: importToAdd
  })

  // insert screen route
  ignite.patchInFile(appNavFilePath, {
    after: 'export {',
    insert: exportToAdd
  })

}
