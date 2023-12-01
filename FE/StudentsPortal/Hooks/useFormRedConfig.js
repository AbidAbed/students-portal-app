function useFormRedConfig(config) {
  const states = config.reduce((statesConfig, component) => {
    statesConfig[component.type] = '';
    return statesConfig;
  }, {});
  return states;
}
export default useFormRedConfig;
