import { FC, ReactNode, useEffect, useState } from 'react';
import { PopupButton } from 'react-calendly';

interface Props {
  className?: string;
  children: ReactNode;
}
export const Calendy: FC<Props> = ({ children }) => {
  const [documentReady, setDocumentReady] = useState(false);
  useEffect(() => {
    setDocumentReady(true);
  }, [documentReady]);

  const pageSettings = {
    hideGdprBanner: true,
  };

  return (
    documentReady && (
      <PopupButton
        className='font-heading mb-1 mr-3 inline-block bg-slate-800 px-7 py-4 text-sm uppercase text-white ring-slate-800 ring-offset-2 transition duration-200 ease-linear hover:bg-slate-900 hover:ring dark:bg-slate-700 dark:ring-slate-700 dark:ring-offset-slate-900 md:px-8 2xl:ring-offset-4'
        url='https://calendly.com/josemukorivo'
        /*
         * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
         * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
         */
        rootElement={document.getElementById('__next')}
        pageSettings={pageSettings}
        text={children.toString()}
      />
    )
  );
};
