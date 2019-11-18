import { IToaster } from '@blueprintjs/core';
import { createContext } from 'react';

const toasterContext = createContext<IToaster>(void 0);

export default toasterContext;
