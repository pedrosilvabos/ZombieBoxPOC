import {Out, render} from 'generated/cutejs/demo/scenes/composed-lists/composed-lists.jst';
import BaseList from 'ui/widgets/base-list/base-list';
import {Value} from 'zb/geometry/direction';
import BaseListItem from '../../widgets/base-list-item/base-list-item';
import {AbstractBase} from '../abstract-base/abstract-base';
import {DataSourceGenerator, DataType} from '../../widgets/data-source-generator/data-source-generator';


/**
 */
export default class ComposedLists extends AbstractBase {
	/**
	 */
	constructor() {
		super();

		/**
		 * @type {DataSourceGenerator}
		 * @private
		 */
		this._sourceGenerator = new DataSourceGenerator({
			dataType: DataType.IMMEDIATELY,
			timeout: 3000
		});

		/**
		 * @type {Out}
		 * @protected
		 */
		this._exported;
		this.baseList = null;
		this.content = null;

		this._addContainerClass('s-composed-lists');
		this._createBaseList(5, 1);
	}

	/**
	 * @param {number} columnsCount
	 * @param {number} index
	 * @param {function()=} callback
	 * @return {BaseList}
	 * @private
	 */
	_createBaseList(columnsCount, index) {
		const itemsCount = columnsCount;

		this.baseList = new BaseList({
			itemClass: BaseListItem,
			options: {
				lineSize: 1,
				padding: 1
			},
			isVertical: true
		});


		this._exported.sliderWrapper.appendChild(this.baseList.getContainer());
		//  this._exported.sliderWrapper.style.width = columnsCount * this.ITEM_WIDTH + 'px';
		this._exported.sliderWrapper.style.position = 'absolute';

		this.appendWidget(this.baseList);

		const source = this._sourceGenerator.getStaticSource(1, itemsCount);
		source.selectAt(index);
		this.baseList.setSource(source);
		if(this.content){
			this.setNavigationRule(this.baseList, Value.UP, null, true);
			this.setNavigationRule(this.baseList, Value.DOWN, null, true);
		}

		this.baseList.on(this.baseList.EVENT_AFTER_MOVE, () => {
			this.showContent();
		});
	}

	/**
	 * @param id
	 */
	showContent() {
		// recycle the list so we dont add on top of the old one
		this.content !== null ? this.removeContent(this.content) : this.content;

		this.content = new BaseList({
			itemClass: BaseListItem,
			options: {
				lineSize: 1,
				padding: 2
			}
		});

		this._exported.contentSliderWrapper.appendChild(this.content.getContainer());
		this._exported.contentSliderWrapper.style.width = '750px';
		this._exported.contentSliderWrapper.style.paddingLeft = '170px';
		this._exported.contentSliderWrapper.style.paddingTop = '400px';

		this.appendWidget(this.content);
		const randomNumber = Math.floor(Math.random() * 10);
		const source = this._sourceGenerator.getStaticSource(randomNumber, randomNumber + 10);
		this.content.setSource(source);
		//this.activateWidget(this.content);
        //this.content.focus()

		// cycle navigation between the content and the baseList
		this.setNavigationRule(this.content, Value.UP, this.baseList, false);
		this.setNavigationRule(this.content, Value.DOWN, this.baseList, true);

		//action
        this.content.on(this.content.EVENT_CLICK, (eventName, item) => {console.log("I WAS CLICKED", item)})
	}

	/**
	 * @param oldContent
	 */
	removeContent(oldContent) {
		this._exported.contentSliderWrapper.removeChild(oldContent.getContainer());
		this.removeWidget(oldContent);
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return render(this._getTemplateData(), this._getTemplateOptions());
	}
}
