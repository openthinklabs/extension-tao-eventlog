/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2016  (original work) Open Assessment Technologies SA;
 *
 * @author Alexander Zagovorichev <zagovorichev@1pt.com>
 */

define([
    'jquery',
    'i18n',
    'helpers',
    'ui/datatable',
    'tpl!taoEventLog/controller/TaoEventLog/show/layout',
    'tpl!taoEventLog/controller/TaoEventLog/show/filters',
    'taoEventLog/components/export/modalExporter',
    'ui/dateRange'
], function ($, __, helpers, datatable, layoutTpl, filtersTpl, exporter, dateRangeFactory) {
    'use strict';

    //the endpoints
    var listUrl = helpers._url('search', 'TaoEventLog', 'taoEventLog');

    return {

        /**
         * Controller entry point
         */
        start: function start() {

            var data = {
                dataTypes: [
                    {key: 'event_name', title: __('Event Name')},
                    {key: 'action', title: __('Action')},
                    {key: 'user_id', title: __('User ID')},
                    {key: 'user_roles', title: __('User Roles')},
                    {key: 'occurred', title: __('Occurred')},
                    {key: 'properties', title: __('Properties')}
                ]
            };

            var $layout = $(layoutTpl(data));
            var $eventFilter = $('.log-browser .log-table-filters', $layout);
            var $eventList = $('.log-browser .log-table', $layout);
            var $eventViewer = $('.event-viewer', $layout);
            var $exportLink = $('.js-export', $layout);

            var $filters = $(filtersTpl());
            var $filterBtn = $('button', $filters);
            var $dateRange = $('.date-range', $filters);
            var $filterText = $('input[name="filter"]', $filters);
            var $filterRange = dateRangeFactory({
                pickerType: 'datetimepicker',
                renderTo: $dateRange,
                pickerConfig: {
                    // configurations from lib/jquery.timePicker.js
                    dateFormat: 'yy-mm-dd',
                    timeFormat: 'HH:mm:ss'
                }
            });

            $filterBtn.off('click').on('click', function() {

                $eventList.datatable('options', {
                    params: {
                        periodStart: $filterRange.getStart(),
                        periodEnd: $filterRange.getEnd(),
                        filterquery: $filterText.val()
                    }
                });

                $eventList.datatable('refresh');

            });

            $filters.appendTo($eventFilter);

            var updateEventDetails = function updateEventDetails(event) {
                for (var k in event) {
                    if (event.hasOwnProperty(k)) {
                        if (k == 'properties') {
                            var json = JSON.parse(JSON.parse(event[k]));
                            var str = JSON.stringify(json, undefined, 2);
                            $('.' + k, $eventViewer).html(
                                '<pre>' + str + '</pre>'
                            );
                        } else if (k == 'user_roles') {
                            $('.' + k, $eventViewer).html(event['user_roles'].split(',').join('<br>'));
                        } else {
                            $('.' + k, $eventViewer).html(event[k]);
                        }
                    }
                }
            };

            $exportLink.on('click', function () {
                exporter({
                    title: __('Export Log Entries'),
                    exportUrl: helpers._url('export', 'TaoEventLog', 'taoEventLog')
                });
            });

            //append the layout to the current view container
            $('.content').append($layout);

            //set up the student list
            $eventList.datatable({
                url: listUrl,
                sortby: 'occurred',
                sortorder: 'desc',
                filter: true,
                rowSelection: true,
                model: [{
                    id: 'identifier',
                    label: __('ID'),
                    transform: function (id, row) {
                        return row.raw.id;
                    }
                }, {
                    id: 'event_name',
                    label: __('Event Name'),
                    sortable: true,
                    filterable: true
                }, {
                    id: 'action',
                    label: __('Action'),
                    sortable: true,
                    filterable: true
                }, {
                    id: 'user_id',
                    label: __('User ID'),
                    sortable: true,
                    filterable: true
                }, {
                    id: 'user_roles',
                    label: __('User Roles'),
                    sortable: true,
                    filterable: true,
                    transform: function (roles) {
                        return roles.split(', ').shift();
                    }
                }, {
                    id: 'occurred',
                    label: __('Occurred'),
                    sortable: true
                }],

                listeners: {
                    /**
                     * When a row is selected, we update the student viewer
                     */
                    selected: function selectRow(e, event) {
                        updateEventDetails(event.raw);

                        //the 1st time it comes hidden
                        $eventViewer.removeClass('hidden');
                    },

                    /**
                     * Set pagination to start position when using filtering
                     * @param e
                     * @param options
                     */
                    filter: function filtered(e, options) {
                        options.page = 1;
                    }

                }
            }).on('create.datatable', function () {
                // the page is now ready
                $layout.trigger('dispatched');
            });
        }
    };
});
