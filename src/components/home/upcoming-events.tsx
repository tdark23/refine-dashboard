import { CalendarOutlined } from '@ant-design/icons';
import { Badge, Card, List } from 'antd';
import { Text } from '../text';
import UpcomingEventsSkeleton from '../skeleton/upcoming-events';
import { getDate } from '@/utilities/helpers';
import { useList } from '@refinedev/core';
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from '@/graphql/queries';

const UpcomingEvents = () => {
  const {
    data,
    isLoading,
  } = useList({
    resource: 'events',
    sorters: [
      {
        field: 'startDate',
        order: 'asc',
      },
    ],
    // Uncomment and import dayjs if you want to filter by current/future events only
    // filters: [
    //   {
    //     field: 'startDate',
    //     operator: 'gte',
    //     value: dayjs().format('YYYY-MM-DD'),
    //   },
    // ],
    pagination: { pageSize: 5 },
    meta: {
      gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
    },
  });

  const events = data?.data || [];

  return (
    <Card
      style={{ height: '100%' }}
      headStyle={{ padding: '8px 16px' }}
      bodyStyle={{ padding: '0 1rem' }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarOutlined />
          <Text size="sm" style={{ marginLeft: '0.7rem' }}>
            Upcoming Events
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({ id: index }))}
          renderItem={() => <UpcomingEventsSkeleton />}
        />
      ) : events.length === 0 ? (
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '220px',
          }}
        >
          No upcoming events
        </span>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={events}
          renderItem={(item) => {
            const renderDate = getDate(item.startDate, item.endDate);
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color={item.color} />}
                  title={<Text size="xs">{renderDate}</Text>}
                  description={
                    <Text ellipsis={{ tooltip: true }} strong>
                      {item.title}
                    </Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
};

export default UpcomingEvents;
