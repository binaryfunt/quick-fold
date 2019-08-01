'use babel';

import QuickFoldView from './quick-fold-view';
import { CompositeDisposable } from 'atom';

export default {

    subscriptions: null,

    activate(state) {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-text-editor', {
            'quick-fold:fold-next': () => this.foldNext();
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    foldNext() {
        console.log('Fold next');
        return 0;
    }

};
