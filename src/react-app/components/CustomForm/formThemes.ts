

import { FormTheme } from "./themes";

export const formTheme: FormTheme = {
  form: {
    container: "space-y-6",
    title: "text-2xl font-bold text-white mb-4",
    description: "text-gray-400 mb-6"
  },
  field: {
    container: "space-y-2",
    label: "block text-sm font-medium text-gray-300",
    input: "w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none transition-all duration-300",
    textarea: "w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none transition-all duration-300 min-h-[120px] resize-vertical",
    select: "w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none transition-all duration-300",
    checkbox: "w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2",
    radio: "w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 focus:ring-yellow-400 focus:ring-2",
    error: "text-red-400 text-sm mt-1",
    description: "text-gray-500 text-sm mt-1"
  },
  button: {
    primary: "w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300",
    secondary: "w-full px-6 py-3 border-2 border-gray-600 text-gray-300 font-medium rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300"
  }
};

