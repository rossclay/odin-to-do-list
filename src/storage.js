const KEY = "to-do";
const saveToLocalStorage = (projects) => {
  try {
    const serializedData = JSON.stringify.apply(
      projects.map((project) => project.toJSON())
    );
    localStorage.setItem(KEY, serializedData);
  } catch (error) {
    console.error("Error saving to local storage: ", error);
  }
};

const loadFromLocalStorage = (project) => {
  try {
    const data = localStorage.getItem(KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      return parsedData.map(project.fromJSON);
    }
    return [];
  } catch (error) {
    console.error("Error loading from local storage: ", error);
    return [];
  }
};

export { saveToLocalStorage, loadFromLocalStorage };
