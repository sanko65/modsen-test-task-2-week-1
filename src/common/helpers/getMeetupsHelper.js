const getWhereClause = function (filters, fieldNames) {
  let whereClause = {};
  for (let filter in filters) {
    if (fieldNames.includes(filter)) {
      whereClause[filter] = {
        contains: filters[filter],
        mode: "insensitive",
      };
    }
  }
  return whereClause;
};

const getOrderByClause = function (sortFields, fieldNames, sortOrders) {
  let orderByClause = {};
  if (sortFields.length) {
    for (let i = 0; i < sortFields.length; i++) {
      if (fieldNames.includes(sortFields[i]) || sortFields[i] === "meetup_id") {
        const order = sortOrders[i] || `asc`;
        orderByClause[sortFields[i]] = order;
      }
    }
  } else {
    orderByClause["meetup_id"] = "asc";
  }
  return orderByClause;
};

module.exports = { getOrderByClause, getWhereClause };
