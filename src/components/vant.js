import { NavBar  } from 'vant';

import { Icon } from 'vant';

import { Button } from 'vant';

import Vue from 'vue';
import { Toast } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Grid, GridItem } from 'vant';
import { Image as VanImage } from 'vant';
import { Lazyload } from 'vant';
import { ShareSheet } from 'vant';

Vue.use(ShareSheet);
Vue.use(Lazyload);
Vue.use(VanImage);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(Cell);
Vue.use(CellGroup);

Vue.use(Toast);
Vue.use(Button);


Vue.use(Icon);
Vue.use(NavBar );