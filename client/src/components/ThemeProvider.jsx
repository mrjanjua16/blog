import { useSelector } from 'react-redux';

export default function ThemeProvider({children}) {
    const {theme} = useSelector((state) => state.theme);

  return (
    <div className={theme}>
        <div className='bg-white text-gray-700 dark:text-green-100 dark:bg-[rgb(16,23,45)] min-h-screen'>
            {children}
        </div>
    </div>
  )
};
