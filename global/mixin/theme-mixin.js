import { useTheme } from '../../global/agency/theme-agency';
const { theme,toggleTheme }  = useTheme();
export default {
	data() {
		return {
			cTheme: theme
		}
	},
	methods:{
		cToggleTheme:function(){
			toggleTheme();
		},
	},
}