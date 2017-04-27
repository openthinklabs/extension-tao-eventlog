<?php
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

namespace oat\taoEventLog\model;

/**
 * Interface StorageInterface
 * @package oat\taoEventLog\model
 */
interface StorageInterface
{
    const SERVICE_ID = 'taoEventLog/storage';

    const EVENT_LOG_ID = 'id';
    const EVENT_LOG_EVENT_NAME = 'event_name';
    const EVENT_LOG_ACTION = 'action';
    const EVENT_LOG_USER_ID = 'user_id';
    const EVENT_LOG_USER_ROLES = 'user_roles';
    const EVENT_LOG_OCCURRED = 'occurred';
    const EVENT_LOG_PROPERTIES = 'properties';

    /**
     * Creates new log record
     * @param LogEntity $logEntity
     */
    public function log(LogEntity $logEntity);

    /**
     * @param LogEntity[] $logEntities
     * @return mixed
     */
    public function bulkLog(array $logEntities);

    /**
     * Search records in log which are meet the search criteria
     * 
     * @param array $filters
     * @param array $options
     * @return array
     */
    public function search(array $filters = [], array $options = []);

    /**
     * Count records in log which are meet the search criteria
     *
     * @param array $filters
     * @param array $options
     * @return integer
     */
    public function count(array $filters = [], array $options = []);

}
